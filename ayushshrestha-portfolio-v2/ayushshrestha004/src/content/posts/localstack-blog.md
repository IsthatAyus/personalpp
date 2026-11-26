---
title: LocalStack Run AWS on Your Laptop (and Stop Fearing the Cloud Bill)
date: 2026-11-26
description: Learn how to run LocalStack on Ubuntu and practice supported AWS workflows locally without creating AWS resources.
tags: [devops, docker, aws, localstack, terraform]
---

If you've ever started learning AWS, you probably know this feeling: you want to try out S3, Lambda, or DynamoDB, but somewhere in the back of your mind there's a little voice saying, *"What if I forget to delete something and get a surprise bill?"*

I've been there. As someone building a career in DevOps and cloud, I wanted a way to practice AWS without the anxiety. That's when I found **LocalStack**, and it changed the way I think about learning and testing cloud infrastructure.

In this post, I'll walk you through what LocalStack is, why it's worth using, how it works under the hood, who it's for, how to install it on Ubuntu, and what my own first experience with it looked like (including the errors I ran into).

---

## What is LocalStack?

**LocalStack is a cloud service emulator that runs on your own machine.** It emulates supported AWS APIs locally, so you can practice workflows such as creating S3 buckets and SQS queues without creating those resources in an AWS account. Service coverage and behavior vary by service, version, and plan, so it is not a perfect copy of AWS.

Think of it like a flight simulator. A pilot trainee doesn't learn on a real plane on day one. They practice in a simulator that behaves like the real thing, where mistakes are cheap and safe. LocalStack is that simulator for AWS.

LocalStack runs inside a Docker container and exposes a gateway endpoint (usually `http://localhost:4566`). Tools such as the AWS CLI, Terraform, and AWS SDKs can be configured to use that endpoint. Make sure your test configuration really targets LocalStack: commands sent to a normal AWS endpoint can still create billable AWS resources.

---

## Why Do We Use LocalStack?

Here are the main reasons developers and DevOps engineers reach for it:

### 1. Avoid AWS usage charges during local experiments
When your tools send requests to the LocalStack endpoint, they do not create the corresponding resources in AWS or incur AWS resource charges for those local operations. LocalStack itself has account, authentication, and plan requirements that can change, and using real AWS endpoints or integrations can still incur AWS charges. Check [LocalStack's current plans](https://www.localstack.cloud/pricing) before you start.

### 2. It's fast
Creating resources locally is dramatically quicker than waiting on the cloud. There's no network latency and no waiting for resources to provision.

### 3. Safe testing of Infrastructure as Code
Writing Terraform, CloudFormation, or AWS CDK? You can run `apply` against LocalStack first and catch mistakes before they go anywhere near a real environment.

### 4. Better CI/CD pipelines
Instead of provisioning real AWS resources for every test run, you can start LocalStack in a pipeline, run supported integration tests against it, and tear the environment down. You still need to manage LocalStack authentication and any plan requirements.

### 5. Local development with limited connectivity
After setup, many workflows can run locally without sending service API requests to AWS. Initial image downloads, authentication, license activation, and integrations may still need internet access; check the current [authentication requirements](https://docs.localstack.cloud/aws/getting-started/auth-token/) before relying on an offline setup.

### 6. A useful place to learn
Beginners can practice supported AWS workflows without creating AWS resources, while still needing to follow LocalStack's account and license requirements. Keep the LocalStack endpoint explicit in your tools so experiments do not accidentally go to AWS.

---

## How Does LocalStack Work?

At a high level, the flow looks like this:

```
Your tools (AWS CLI / Terraform / SDK / app)
              │
              ▼
   http://localhost:4566   ← LocalStack gateway
              │
              ▼
   Emulated AWS services (S3, Lambda, SQS, DynamoDB, ...)
              │
              ▼
   Emulated state kept locally (persistence depends on configuration)
```

Here's what's happening step by step:

1. **LocalStack starts as a Docker container** and listens on port `4566`.
2. **You point your AWS tooling at that endpoint.** With the AWS CLI, that's the `--endpoint-url` flag.
3. **LocalStack receives the API request** and routes it to its implementation of that AWS service.
4. **LocalStack emulates the service API** for supported operations. Responses and edge-case behavior may differ from AWS, and some services or features may depend on your LocalStack plan.

Because it speaks many of the same APIs as AWS, your code can often be tested with endpoint and credential configuration changes. You may still need LocalStack-specific setup, and local state is not necessarily preserved across restarts unless persistence is enabled.

---

## Who Should Use LocalStack?

LocalStack is a great fit for:

- **Students and beginners** learning supported AWS workflows without creating resources in a real AWS account
- **DevOps engineers** testing Terraform, CloudFormation, or CDK before deploying
- **Backend developers** building apps that depend on S3, SQS, SNS, or DynamoDB
- **QA and test engineers** who need repeatable integration test environments
- **Teams with CI/CD pipelines** that want fast, isolated tests without provisioning AWS resources for every run

For supported test workflows, LocalStack can save setup time and AWS resource charges. Whether LocalStack itself has a cost depends on its current plan.

> **A fair note:** LocalStack is an emulator, not a perfect copy of AWS. Service coverage and behavior vary, and LocalStack requires an account, authentication, and an eligible license; check its current plans for what's included. Always validate in a real AWS environment before going to production.

---

## How to Install LocalStack on Ubuntu

Here's a current CLI-based setup for Ubuntu. LocalStack now recommends `lstk`; the legacy `localstack` CLI used in my earlier attempt is deprecated. Follow the [official installation guide](https://docs.localstack.cloud/aws/getting-started/installation/) if the commands change.

### Prerequisites: Install Docker

LocalStack runs in Docker, so you'll need it first.

Install Docker Engine by following Docker's [official Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/), then verify the daemon is running:

```bash
docker --version
docker info
```

> **Security note:** Membership in the `docker` group effectively grants root-level control of the host. Only add trusted users to it; using `sudo docker ...` is another option.

### Install the `lstk` CLI

If you already have Node.js and npm installed, install the current CLI from npm:

```bash
npm install --global @localstack/lstk
lstk --version
```

If you do not use npm, follow the official guide's pre-built binary instructions for Linux rather than copying an old version number or release URL.

### Authenticate and start LocalStack

LocalStack for AWS requires authentication and an eligible license. On first start, `lstk` guides you through browser-based sign-in and stores authentication locally:

```bash
lstk doctor
lstk start --type aws
```

Check the current plan and license requirements before using it. Never commit an auth token or put it in a public repository.

Verify that it is running and responding:

```bash
lstk status
curl http://localhost:4566/_localstack/health
```

### Try It Out

If you don't already have it, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). Then create an S3 bucket:

The commands below explicitly use the LocalStack endpoint. Do not remove `--endpoint-url` when testing; without a local endpoint your AWS CLI may use real AWS credentials and create chargeable resources.

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-first-bucket
aws --endpoint-url=http://localhost:4566 s3 ls
```

If you see `my-first-bucket` in the list, congratulations. You just ran AWS on your own laptop.

> **Tip:** If the AWS CLI complains about credentials, set dummy values for local use. Keep them scoped to your local shell and continue to specify the LocalStack endpoint:
> ```bash
> export AWS_ACCESS_KEY_ID=test
> export AWS_SECRET_ACCESS_KEY=test
> export AWS_DEFAULT_REGION=us-east-1
> ```

---

## My Experience Using LocalStack

I'll be honest: my first attempt didn't go perfectly smoothly, and that's exactly why I think it's worth sharing.

### Error #1: The legacy CLI version did not match my license

In an earlier attempt, I installed the legacy CLI version 3.8.1, set my auth token, and ran `localstack start`. Instead of a running container, I got this:

```
License activation failed!
Reason: Your LocalStack license requires you to use localstack-pro version 4.4.0 or higher. Please upgrade.
```

The lesson: **check the CLI and license requirements together.** An older CLI can fail even with a valid token. The legacy `localstack` CLI is now deprecated; use the recommended `lstk` CLI and current official installation instructions rather than copying old version numbers from tutorials.

### Error #2: A broken manual download

When I tried to grab a release using a wildcard in the URL, the download "succeeded" but returned a tiny 9-byte file, and `tar` failed with `gzip: stdin: not in gzip format`. Wildcards do not select a matching asset in a GitHub release URL. The current `lstk` installation flow avoids this manual download step; if you install a binary yourself, use the exact asset link from the official instructions.

### What I took away from it

- **Read the error message carefully.** Both errors told me exactly what was wrong.
- **Version numbers matter.** Don't blindly reuse old commands.
- **Check file sizes when a download fails.** A 9-byte "archive" is a sign you downloaded an error page, not the real file.

Those early errors taught me to check the CLI version and download source before assuming my token or Docker setup was the problem. Using the current `lstk` flow also makes the initial authentication and startup process clearer.

---

## Where LocalStack Fits in a DevOps Workflow

Now that I've got it running, here's how I plan to use it:

- **Practicing Terraform** against supported local AWS services before touching a real account
- **Testing Lambda and S3 workflows** without provisioning those resources in AWS (check LocalStack's plan requirements)
- **Building CI/CD pipelines** that run integration tests against a throwaway environment
- **Preparing for AWS certifications** with hands-on practice in a risk-free sandbox

---

## Final Thoughts

LocalStack removes one of the biggest barriers to learning cloud: the fear of cost. It gives you a place to experiment, break things, fix them, and learn, all from your own machine.

Is it a replacement for real AWS? No. But as a development, testing, and learning tool for supported workflows, it's a useful addition to a DevOps toolkit. Confirm your tools target LocalStack, review its current plan requirements, and validate behavior in AWS before production.

If you run into trouble while installing it, don't get discouraged. I hit two errors in my first ten minutes, and solving them taught me more than a smooth install would have.

Happy building!

---