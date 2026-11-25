---
title: Hosting Automation Platform
date: 2026-11-25
description: I built an automated web hosting billing platform using FossBilling, Plesk, Namecheap and Docker. Here is how it works, what broke, and what I learned.
tags: [devops, docker, web hosting]
---

## Why I built this

Every hosting business faces the same problem. A customer buys a plan, and then someone has to manually create the account, send the login details, register the domain, and remember to chase the renewal. Done by hand, this is slow and easy to get wrong.

I wanted to see whether I could remove the human from that loop. The goal was simple: a customer orders and pays, and everything else happens on its own. This post is the story of how I built that, what I used, and the problems that made me a better engineer along the way.

## The big picture: how hosting automation works

The platform is made of a few cooperating pieces, and each one has a single job:

- **FossBilling** is the storefront and billing brain. Customers browse plans, place orders, receive invoices, and manage their accounts here.
- **Plesk** is the control panel that actually runs the websites. When an order is activated, Plesk creates the customer and their hosting space.
- **Namecheap** is the domain registrar. When someone buys a domain, the platform talks to Namecheap so the name is registered without anyone lifting a finger.
- **Docker** packages the whole thing so it runs the same way on my laptop and on a production server.
- **MySQL** stores clients, orders, invoices, and settings.
- **Email (SMTP)** keeps customers informed at every important moment.

The flow reads like a story:

1. A customer picks a plan and an invoice is generated.
2. Once the invoice is paid, the order activates.
3. The billing system tells Plesk to create the account.
4. The customer receives an email with their details.
5. Months later, an automated reminder warns them before the service expires.

## Why I chose open-source tools

I chose FossBilling because it is a free, open-source billing platform that already covers invoices, clients, products, and a module system. Building billing from scratch would have taken months, and the problems it solves are already well understood.

Starting from a solid base let me spend my time on the part that mattered: connecting it reliably to Plesk and the domain registrar.

## Connecting billing to the hosting server

The heart of the project is the link between FossBilling and Plesk. Plesk exposes an API, and FossBilling ships with a Plesk server manager that uses it. In theory, you enter your server details and you are done.

In practice, this is where most of my learning happened. I connected the server using an administrator login, mirrored my hosting plans inside FossBilling, and matched every plan name exactly to the ones in Plesk. A small mismatch in naming is enough to break the whole chain, so I learned to treat plan names as part of the configuration, not just labels.

## The bugs that taught me the most

Open-source software is a great starting point, but it is not always ready for your exact use case. I ran into several real problems and fixed each one carefully.

### Plans showing up as custom in Plesk

Subscriptions were being created as a custom plan instead of the named plan I had selected. The fix was to make the integration reference the plan by name so Plesk applies its own limits.

### Hosting credentials going missing

The username and password were being replaced with a placeholder before they were safely stored. I reordered the process so credentials are saved first, and added an automatic email so customers receive their login details the moment their account is ready.

### Accounts not being created for manually placed orders

Orders placed by an administrator behaved differently from orders placed by customers. After tracing the flow step by step, I found that manual orders were flagged as already existing, so the platform skipped account creation entirely. I changed the behaviour so the account is always attempted.

### Strict server rules

Plesk enforces its own rules for usernames and password strength. Weak or oddly formatted values were rejected without a clear message. I made the integration normalise usernames and guarantee strong passwords, and I added clearer logging so failures are no longer silent.

### Domains that standard validation rejected

Nepal's domain extensions were not recognised by the built-in validation. I handled this so local domains can be ordered, with registration done manually where the registrar does not support them.

### Plan settings that triggered reseller restrictions

Some plans were configured as reseller accounts, which the server licence did not allow. Reviewing the product settings resolved it. This reminded me that sometimes the bug is not in the code at all, but in the configuration.

> **The lesson:** When automation fails silently, add visibility first. Better logging turned hours of guessing into minutes of fixing.

## Automated reminders before services expire

One gap I wanted to close was renewals. The platform had no built-in way to warn customers before a service ended. I built a small scheduled task that checks for services nearing expiry and emails the customer at 30, 15, and 5 days beforehand.

It runs once a day, so each customer gets a gentle, timely nudge instead of a surprise suspension.

## Giving staff limited access

A real business does not hand every team member the keys to everything. I wanted support staff to place orders and manage clients without seeing invoices or editing products.

FossBilling controls access at the module level, which created some awkward moments where pages crashed for restricted staff. I adjusted the affected screens so they respect permissions gracefully, and made the product area read-only for staff. The result is a team member who can do their job and nothing more.

## Making it deployable: one command, repeatable setup

The part I am proudest of is the deployment story. During development I applied fixes by hand, which is fine for experiments but not for production. On a real server, you do not want to log into containers and copy files around.

So I reorganised the project around a simple idea: keep every modified file in a version-controlled folder, and have Docker mount those files into the right places when the containers start. Now a fresh server needs only the repository and a single start command. Every fix is applied automatically, and the setup is identical every time.

This also makes updates safe. I change a file, commit it, pull it on the server, and restart. Everything is tracked, reviewable, and reversible.

## What I learned

- **Read the logs before you change the code.** Most of my breakthroughs came from simply seeing what the system was actually saying.
- **Configuration is part of the product.** Mismatched names, flags, and permissions caused as many problems as real bugs.
- **Reproducible beats clever.** A setup anyone can recreate with one command is worth more than a perfect setup only I understand.
- **Test the unglamorous paths.** Customer orders worked first. It was the administrator path that exposed the hidden assumptions.
- **Document as you go.** Writing the setup guide forced me to understand my own system properly.

## Final thoughts

Hosting automation looks magical from the outside, but underneath it is a chain of small, dependable steps. Getting each link right, and being able to see when one breaks, is what makes the whole thing trustworthy.

If you are building something similar or want to talk about billing automation, Plesk integration, or Docker deployments, I would love to hear from you.
