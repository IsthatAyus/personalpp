---
title: Monitoring Around 100 Docker Containers with Prometheus and Grafana
date: 2026-11-26
description: How I monitored around 100 Docker containers across two servers with Prometheus, Grafana, cAdvisor, and node-exporter.
tags: [devops, docker, grafana]
---


## Why I'm writing this

During my DevOps internship, my mentor gave me a task that sounded simple:

> "Check the health of the containers on our office server using Grafana and Prometheus."

I had heard of both tools, but I had never set them up. I thought it would take an hour.

It took a few days, a lot of "why is it showing No data??", and more SSH confusion than I'd like to admit. But I learned more from that one task than from any tutorial I'd watched.

This post is everything I wish someone had told me before I started: what these tools are, why they matter, how I set them up, the problems I hit, and tips so you don't hit the same ones.

---

## What are Prometheus and Grafana?

Think of it like a hospital for your servers.

**Prometheus** is the nurse who walks around every 15 seconds, checks every patient's temperature, heart rate and blood pressure, and writes it all down in a chart. In technical terms, it's a **time-series database** that *scrapes* (pulls) metrics from your servers on a schedule and stores them.

**Grafana** is the screen on the wall that turns all those numbers into pretty, readable dashboards. It doesn't collect anything itself. It just asks Prometheus for data and draws graphs.

On their own, neither is very useful for this job. Together, they're the standard monitoring combo in the DevOps world.

There are also two helpers that sit on the servers you want to watch:

| Tool | What it does |
|---|---|
| **cAdvisor** | Exposes metrics about your **Docker containers** (CPU, memory, network, disk per container) |
| **node-exporter** | Exposes metrics about the **server itself** (total CPU, RAM, disk space, uptime) |

---

## Why bother with monitoring?

Before this, if someone asked "is the server okay?", the honest answer was "um, let me SSH in and run `docker ps`".

That doesn't scale. Here's why monitoring matters:

- **You find out about problems before users do.** A container using 100% memory is a warning, not a surprise.
- **You get history.** "Was the server slow last night?" becomes a question you can actually answer.
- **You can plan.** If disk usage grows 2% a week, you know when you'll run out.
- **You can get alerted.** You don't have to stare at a dashboard all day. The system emails you when something breaks.

The server I worked on had around 100 containers. Checking them by hand was never going to work.

---

## When should you use this stack?

Use Prometheus + Grafana when:

- You run Docker containers or several servers and want one place to see them all
- You want alerts when CPU, memory, disk or containers go wrong
- You want historical data, not just a snapshot of right now
- You want something free, open source and widely used (great for your CV too)

It might be overkill if you have a single tiny app on one server. A simple uptime checker could be enough there.

---

## The architecture (how the pieces fit)

```
Server A (cAdvisor + node-exporter) ──┐
                                      ├──► Prometheus ──► Grafana ──► You (browser)
Server B (cAdvisor + node-exporter) ──┘
```

The key idea: **Prometheus pulls** from the exporters, and **Grafana only talks to Prometheus.** Grafana never talks to cAdvisor directly. I got confused about this at first.

---

## My journey: two setups

I actually built this twice.

1. **First version:** Prometheus and Grafana running **on my own laptop**, scraping the office server over the LAN. Great for learning.
2. **Final version:** My mentor wanted everything **centralized on one server**, with Prometheus and Grafana living there and scraping two servers (including itself). That's closer to how real teams do it.

The steps are almost identical either way. Only *where* Prometheus and Grafana run changes.

---

## Installation: the step-by-step version

You'll need Docker and Docker Compose. I'm on Ubuntu.

### Step 1: Put cAdvisor on the server you want to monitor

> **Security note:** These commands are learning examples, not a hardened production setup. The exporters expose metrics without authentication, and the Docker port mappings below listen on all host interfaces by default. Restrict exporter access to the Prometheus server using a private network and host firewall rules, and verify that your firewall filters Docker-published traffic. The cAdvisor example also uses `--privileged` and mounts host resources, so only run it on servers you administer and review the permissions for your environment. For production, pin tested image versions instead of using `latest`.

```bash
docker run -d \
  --name=cadvisor \
  --restart=always \
  --privileged \
  -p 9200:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:rw \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  -v /dev/disk/:/dev/disk:ro \
  gcr.io/cadvisor/cadvisor:latest \
  --docker_only=true \
  --store_container_labels=true
```

Check it works:

```bash
curl -s http://localhost:9200/metrics | head
```

If you see lines starting with `# HELP`, you're good.

The `-p 9200:8080` mapping publishes cAdvisor on the host's interfaces. Allow only the Prometheus server to reach this port; do not expose exporter endpoints directly to the public internet.

### Step 2: Put node-exporter on the same server

```bash
docker run -d \
  --name=node-exporter \
  --restart=always \
  -p 9101:9100 \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  prom/node-exporter:latest \
  --path.rootfs=/host
```

I used port `9101` because `9100` was already taken by an older node-exporter on that server. Always check which ports are free first (`ss -tulnp | grep 9101`).

Like the cAdvisor mapping, `-p 9101:9100` publishes node-exporter on the host's interfaces. Restrict access to your monitoring network or the Prometheus server.

### Step 3: Write the Prometheus config

Create `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'cadvisor-server-a'
    static_configs:
      - targets: ['<server-a-ip>:9200']
        labels:
          server: 'server-a'

  - job_name: 'node-exporter-server-a'
    static_configs:
      - targets: ['<server-a-ip>:9101']
        labels:
          server: 'server-a'

  - job_name: 'cadvisor-server-b'
    static_configs:
      - targets: ['<server-b-ip>:9200']
        labels:
          server: 'server-b'

  - job_name: 'node-exporter-server-b'
    static_configs:
      - targets: ['<server-b-ip>:9101']
        labels:
          server: 'server-b'
```

> **Tip:** Adding a `server:` label to each job makes it much easier to tell servers apart later.

### Step 4: Docker Compose for Prometheus + Grafana

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: "${GRAFANA_ADMIN_PASSWORD:?Set GRAFANA_ADMIN_PASSWORD before starting Compose}"
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

Set `GRAFANA_ADMIN_PASSWORD` using your deployment environment or a secret manager; never commit a real password to Compose or Git. Environment-variable injection is a simple example, not a full secrets-management solution. These port mappings also listen on all host interfaces by default. Restrict access to Prometheus and Grafana with firewall rules or a private management network, verify that the firewall filters Docker-published traffic, and use an authenticated access path for the Grafana UI.

Start it:

```bash
docker compose up -d
```

### Step 5: Check that Prometheus can see everything

Open `http://localhost:9090/targets`. Every target should say **UP** in green. If something is red, don't continue yet. Fix that first (see the problems section below).

### Step 6: Connect Grafana to Prometheus

1. Open `http://localhost:3000` and log in
2. **Connections → Data sources → Add data source → Prometheus**
3. URL: `http://prometheus:9090` (use the container name, **not** `localhost`)
4. Click **Save & test**

### Step 7: Import ready-made dashboards

You don't need to build dashboards from scratch. Go to **Dashboards → New → Import** and enter:

- **`15798`** for Docker container monitoring (cAdvisor)
- **`1860`** for Node Exporter Full (server health)

Pick your Prometheus data source and click Import. Done.

---

## Problems I hit (and how I fixed them)

This is the section I care about most. Almost none of these were in the tutorials I read.

### 1. "Connection refused" when SSHing

I was told the server was on "port 38". It was actually the **last part of the IP address** (`192.168.1.38`), not an SSH port. I wasted a good while trying `ssh -p 38`.

**Lesson:** Ask exactly what a number means. Also read the onboarding email again. It had the real SSH details.

### 2. SSH kept asking for a password

I only had key-based login, so I had no password. The fix was running `ssh -v user@host` and reading which key file SSH was actually offering. It was `~/.ssh/id_ed25519`.

**Lesson:** `ssh -v` is your friend. It tells you exactly what's happening.

### 3. The node-exporter endpoint returned `403 Forbidden`

The endpoint returned HTTP `403`, which means the server responded but denied the request; it is different from a timeout or connection refusal. In `docker ps`, the existing container showed `9100/tcp` without a published host-port mapping. That tells you Docker is not publishing the port through its usual bridge mapping; it does not prove the service is unreachable by every other route. I chose not to change someone else's configuration and coordinated a separate exporter setup on another port.

**Lesson:** Check the HTTP status, logs, firewall, and `PORTS` column together. `0.0.0.0:9100->9100/tcp` means Docker published the port on all IPv4 interfaces, but the absence of that entry alone does not establish whether the service is reachable. A `403` is an access-control response; ask the service owner to resolve it rather than bypassing the control.

### 4. Dashboards showed "No data"

This was the biggest time sink. The imported dashboard queried a label called `container`, while the cAdvisor metrics I was using exposed container names under the label **`name`**. Label names can vary with exporter versions, configuration, and dashboard queries, so check the labels in your own Prometheus data before changing a dashboard.

In my dashboard, I changed the affected queries from `container=~"$container"` to `name=~"$container"`, and from `sum by (container)` to `sum by (name)`.

**Lesson:** Before blaming Grafana, open Prometheus (`:9090`), run a metric like `container_memory_usage_bytes`, and **look at the labels** on the result. Then make your dashboard match.

### 5. Dashboard variable dropdowns were empty

The dropdown at the top of the dashboard (Job, Host, Container) is powered by its own query. Mine returned nothing because of the wrong label, and later because I'd named the variable `name` while the panels used `$container`.

**Lesson:** The variable's **Name** field must match what the panels use. `$container` needs a variable called `container`.

### 6. Everything suddenly broke after a cAdvisor restart

After restarting cAdvisor, my dashboards went blank because their queries no longer matched the labels I expected. Redeploying with the flags and mounts shown above restored the metrics in my setup, but I did not isolate one definitive cause. `--privileged` and a read-write `/var/run` mount grant broad host access; they are not a general fix for missing labels. Check target health, cAdvisor logs, and the actual metric labels first, then grant only the access your environment requires.

**Lesson:** Put your exporters in a Compose file so their configuration is repeatable, and verify targets and labels after a restart.

### 7. Prometheus couldn't scrape node-exporter on its own host

When Prometheus ran in a Docker network on the same server as node-exporter, scraping the server's LAN IP timed out (`context deadline exceeded`), even though the port was open. Using the **Docker network gateway IP** (found with `docker network inspect <network> | grep Gateway`) fixed it.

**Lesson:** A container reaching the host's published port via its LAN IP isn't always reliable. The gateway IP of the Docker network often is.

### 8. Email alerts said "SMTP not configured"

I'd added the `GF_SMTP_*` variables to Compose, but `docker compose restart` does **not** reload environment variables. I needed:

```bash
docker compose down && docker compose up -d
```

**Lesson:** `restart` keeps the old container. `down` then `up` recreates it with the new settings.

### 9. Gmail wouldn't accept my normal password

Gmail needs an **App Password** (turn on 2-step verification first). A normal password won't work for SMTP.

### 10. The "Running containers" count was wrong

Grafana showed about double the number of containers that were really running. cAdvisor exposes multiple series per container, so a plain `count()` overcounts. De-duplicating by name first (`count(count by (name)(...))`) is the right idea. I'll be honest, I was still polishing this one when I wrote the post.

---

## Setting up alerts (so you don't have to watch dashboards)

I used **Grafana alerting** rather than Prometheus Alertmanager. It's built in, configured in the browser, and much friendlier for a beginner.

The alerts I created:

| Alert | Threshold |
|---|---|
| High CPU | above 80% for 5 minutes |
| High memory | above 85% for 5 minutes |
| High system load | above 100% of cores |
| Critical container missing | no matching metric for 2 minutes (one expected container at a time) |
| High disk usage | above 80% |

A few example queries:

```promql
# CPU %
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory %
100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))

# Disk % on root
100 - ((node_filesystem_avail_bytes{mountpoint="/", fstype!="tmpfs"} / node_filesystem_size_bytes{mountpoint="/", fstype!="tmpfs"}) * 100)

# Age of the last observation for containers that still have a time series.
# This query alone cannot detect a series that has disappeared.
time() - container_last_seen{name=~".+"}

# Example alert query for one known, expected container. Verify the label name
# in your own metrics; repeat per expected container or compare with an inventory.
absent_over_time(container_last_seen{name="my-critical-container"}[2m])
```

`absent_over_time` is useful when you know which container should exist. A broad selector cannot tell you which of many dynamically created containers has disappeared; for that, compare the observed containers with an expected inventory or use a metric that reports container state.

Things worth knowing:

- Set the **default notification policy** to your contact point, or alerts fire but no email is sent.
- Use a **pending period** (like 5 minutes) so short spikes don't spam you.
- Use the **Silence** button in the email during maintenance instead of deleting rules.
- I tried to make a fancy custom HTML email, but Grafana's default template looked clean already and the custom one just showed raw HTML. Sometimes the default is the right answer.

---

## Tips for anyone starting out

1. **Check Prometheus first, Grafana second.** If `/targets` isn't all green, no dashboard will save you.
2. **Look at labels.** Most "No data" problems are a label name mismatch.
3. **Use ready-made dashboards.** Import `15798` and `1860`, then tweak them. Don't build from scratch on day one.
4. **Use service names on the same Compose network.** Grafana can use `http://prometheus:9090` when both services share a Docker network; `localhost` inside Grafana refers to the Grafana container itself.
5. **Always add `--restart=always` or `unless-stopped`** to monitoring containers.
6. **Label your servers.** Adding `server: 'name'` in `prometheus.yml` saves you later.
7. **Don't touch other people's setups.** If a server already has something running, deploy your own on a different port.
8. **Keep secrets out of chats, screenshots and Git.** I once pasted a temporary app password into a chat and revoked it. Treat any exposed credential as compromised: revoke or rotate it immediately, and use a secret manager for deployed services.
9. **Watch your own disk.** While monitoring, I noticed one server's disk was getting very full. That's exactly the sort of thing monitoring exists to catch.
10. **Write things down.** I documented every step as I went. It made this blog easy and helped my mentor too.

---

## Useful queries to bookmark

```promql
up                         # Is every target reachable? 1 = yes, 0 = no
up == 0                    # Show only what's down
container_memory_usage_bytes
rate(container_cpu_usage_seconds_total[1m])
node_uname_info            # Server hostname, OS, kernel
```

---

## What I learned

Technically, I learned how metrics flow from exporters to Prometheus to Grafana, how PromQL works, and how Docker networking behaves.

More importantly, I learned how to **debug systematically**: check each link in the chain, one at a time, from the server up to the dashboard. Most of my problems weren't "Grafana is broken". They were a wrong port, a wrong label or a wrong variable name.

---

## What's next for me

- Kubernetes, because monitoring containers makes me curious about orchestrating them
- Terraform and cloud (AWS) basics
- CI/CD pipelines with GitHub Actions
- Adding Loki for logs alongside metrics

If you're also starting your DevOps journey, I hope this saves you some of the headaches I had. If you get stuck, remember: **check the targets page, check the labels, and read the error message slowly.**

Happy monitoring! 🚀

*- Ayush*
