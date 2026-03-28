# Deploying to a VPS with Traefik

This guide explains how to deploy Marihella's blog to a VPS (Virtual Private Server) behind Traefik, which handles HTTPS and routing automatically.

## Prerequisites

On your VPS you need:
- **Docker** and **Docker Compose** installed
- **Traefik** already running (see the `reference/traefik/` folder for the Traefik setup)
- A **domain name** pointing to your VPS IP address
- A Docker network called `proxy` that Traefik uses

## Step 1: Get the code onto your VPS

Copy or clone the project to your server. For example:

```bash
# On your VPS
cd /opt
git clone <your-repo-url> marihella-blog
cd marihella-blog
```

## Step 2: Set your domain name

Open `docker-compose.yml` and change this line:

```yaml
traefik.http.routers.marihella.rule: "Host(`marihella.example.com`)"
```

Replace `marihella.example.com` with your actual domain.

## Step 3: Build and start

```bash
docker compose up -d --build
```

This will:
1. Build the site inside a Docker container
2. Serve it with Nginx
3. Traefik will automatically detect it and set up HTTPS with Let's Encrypt

## Step 4: Verify

Open your domain in a browser. You should see the site with a valid HTTPS certificate.

## Updating the site

After making changes to content or code:

```bash
cd /opt/marihella-blog
git pull                        # get the latest changes
docker compose up -d --build    # rebuild and restart
```

## How it works

The setup uses two stages:

1. **Build stage** — Node.js installs dependencies and builds the site into static HTML
2. **Production stage** — Nginx serves the static files (very fast, very light)

The `docker-compose.yml` includes Traefik labels that tell Traefik:
- Which domain to route to this container
- Which port the container listens on (80)
- To use the `websecure` entrypoint (HTTPS)
- To use Let's Encrypt for the certificate

## File reference

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds the site and serves it with Nginx |
| `docker-compose.yml` | Defines the service and Traefik labels |
| `nginx.conf` | Nginx configuration for serving the static site |
| `.dockerignore` | Keeps unnecessary files out of the Docker build |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Site not reachable | Check that the `proxy` network exists: `docker network ls` |
| No HTTPS | Make sure your domain DNS points to the VPS and Traefik has the Let's Encrypt resolver configured |
| Old content showing | Rebuild with `docker compose up -d --build` |
| Container won't start | Check logs with `docker compose logs marihella-blog` |
