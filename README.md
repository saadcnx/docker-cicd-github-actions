# 🚀 Docker CI/CD — Automated Builds with GitHub Actions

A complete CI/CD pipeline that automatically builds, tests, and publishes a Docker image to Docker Hub on every push — powered by GitHub Actions and Docker Compose.

---

## 📦 Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js + Express | Web application backend |
| Docker | Container runtime |
| Docker Compose | Multi-service local orchestration |
| GitHub Actions | CI/CD automation |
| Docker Hub | Container image registry |
| Nginx | Reverse proxy |

---

## 🏗️ Pipeline Architecture

```
 Developer pushes code
         │
         ▼
  ┌─────────────────────────────────┐
  │     GitHub Actions Workflow      │
  │                                  │
  │  Job 1: build-and-test           │
  │  ├── Install dependencies        │
  │  ├── Run unit tests              │
  │  ├── Build Docker image          │
  │  ├── Test Docker container       │
  │  └── Docker Compose integration  │
  │         tests                    │
  │                                  │
  │  Job 2: build-and-push           │
  │  (only on main branch)           │
  │  ├── Login to Docker Hub         │
  │  ├── Build & tag image           │
  │  ├── Push to Docker Hub          │
  │  └── Verify pushed image         │
  └─────────────────────────────────┘
         │
         ▼
   Docker Hub Registry
   └── saadcnx/docker-cicd-github-action:latest
   └── saadcnx/docker-cicd-github-action:main-49356c6
```

---

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── docker.yml          # GitHub Actions CI/CD workflow
├── scripts/
│   └── integration-test.sh     # Integration test script
├── app.js                      # Express web server
├── test.js                     # Health check test
├── package.json                # Node.js dependencies
├── Dockerfile                  # Container image definition
├── docker-compose.yml          # Local development stack
├── docker-compose.test.yml     # CI/CD integration test stack
└── nginx.conf                  # Nginx reverse proxy config
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) `v20.10+`
- [Docker Compose](https://docs.docker.com/compose/install/) `v2.x`
- [Node.js](https://nodejs.org/) `v18+`
- A [Docker Hub](https://hub.docker.com) account
- A [GitHub](https://github.com) account

### Run Locally

```bash
git clone https://github.com/saadcnx/docker-cicd-github-actions.git
cd docker-cicd-github-actions
```

```bash
# Start the full stack
docker-compose up -d

# Run integration tests
./scripts/integration-test.sh

# Tear down
docker-compose down
```

App will be at `http://localhost:3009` and via Nginx at `http://localhost:8080`

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Returns app info and version |
| `GET` | `/health` | Health check + uptime |

### Example

```bash
curl http://localhost:3009/
# {"message":"Hello from Docker CI/CD Demo!","timestamp":"...","version":"1.0.0"}

curl http://localhost:3009/health
# {"status":"healthy","uptime":42.3}
```

---

## ⚙️ CI/CD Setup

### 1. Create Docker Hub Repository

Go to [hub.docker.com](https://hub.docker.com) → **Create Repository** → name it `docker-cicd-github-action`.

### 2. Generate a Docker Hub Access Token

Docker Hub → **Account Settings** → **Security** → **New Access Token**

> Use an access token instead of your password — it can be revoked independently.

### 3. Add GitHub Secrets

In your GitHub repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret Name | Value |
|-------------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub access token |

### 4. Push to Trigger the Pipeline

```bash
git add .
git commit -m "trigger: ci/cd pipeline"
git push origin main
```

Watch it run under the **Actions** tab in your GitHub repo.

---

## 🔄 Workflow Jobs

### `build-and-test` — runs on every push & PR

- Installs Node.js dependencies
- Runs unit tests against live server
- Builds Docker image
- Spins up container and validates `/health`
- Runs full Docker Compose stack + integration tests
- Dumps service logs on failure (always)
- Cleans up all containers and volumes

### `build-and-push` — runs on `main` branch only

- Requires `build-and-test` to pass
- Authenticates with Docker Hub
- Builds and pushes image with tags:
  - `latest`
  - `main-<commit-sha>`
  - branch name
- Pulls and smoke-tests the pushed image

---

## 🏷️ Image Tags on Docker Hub

| Tag | When created |
|-----|-------------|
| `latest` | Every push to `main` |
| `main-<sha>` | Every push to `main` (commit-pinned) |
| `<branch-name>` | Any branch push |

Pull the latest image:

```bash
docker pull saadcnx/docker-cicd-github-action:latest
docker run -p 3009:3000 saadcnx/docker-cicd-github-action
```

---

## 🧪 Running Tests

### Unit Test

```bash
npm install
npm start &
npm test
```

### Integration Tests (Docker Compose)

```bash
docker-compose up -d
sleep 15
./scripts/integration-test.sh
docker-compose down
```

The integration script validates:
- App health endpoint responds correctly
- App returns expected JSON payload
- Nginx proxy forwards requests properly
- 10-request load test completes without errors

---

## 🐛 Troubleshooting

**Docker Hub auth fails in pipeline**
- Confirm secret names are exactly `DOCKER_USERNAME` and `DOCKER_PASSWORD`
- Use an access token, not your account password
- Ensure the Docker Hub repo exists before the first push

**Services don't start in CI**
- Increase `sleep` durations in workflow steps
- Check health check intervals in `docker-compose.yml`
- Review logs in the workflow's "Check service logs" step

**Tests pass locally but fail in CI**
- Services may need more startup time in CI environments
- Verify no port conflicts in the runner
- Check that all files referenced in `docker-compose.yml` are committed

**Image build fails**
- Run `docker build .` locally to reproduce the error
- Ensure `.dockerignore` doesn't exclude required files
- Verify the base image tag is valid

---

## 🔒 Security Practices

- No secrets or credentials committed to the repository
- Docker Hub credentials stored exclusively as GitHub Secrets
- Container runs as a **non-root user** (`nodejs` uid 1001)
- Access tokens used instead of account passwords
- Images tagged with commit SHAs for full traceability

---

## 📄 License

MIT — free to use, modify, and distribute.
