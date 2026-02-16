---
layout: default
title: Installation
parent: Documentation
nav_order: 2
---

# Installation

## Web Application (Docker)

The fastest way to get started. Requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

```bash
git clone https://github.com/predomics/predomicsapp-web.git
cd predomicsapp-web
docker compose up -d
```

Open [http://localhost:8001](http://localhost:8001) in your browser. A default admin account is created on first launch.

### Environment Variables

Key environment variables (set in `docker-compose.yml` or `.env`):

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | PostgreSQL connection | Database connection string |
| `SECRET_KEY` | auto-generated | JWT signing key |
| `DEFAULT_ADMIN_EMAIL` | `admin@predomics.local` | Initial admin email |
| `DEFAULT_ADMIN_PASSWORD` | `admin` | Initial admin password |
| `PROJECT_DIR` | `/data/projects` | Storage directory for project files |

### Building from Source

For development or customization:

```bash
git clone https://github.com/predomics/predomicsapp-web.git
cd predomicsapp-web

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
npm run dev
```

## Python Bindings (gpredomicspy)

Requires the Rust toolchain for compilation.

### 1. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Clone and Build

```bash
git clone https://github.com/predomics/gpredomics.git
git clone https://github.com/predomics/gpredomicspy.git
cd gpredomicspy
pip install maturin
maturin develop --release
```

### 3. Verify Installation

```python
import gpredomicspy
print(gpredomicspy.__version__)
```

### GPU Support (Optional)

For CUDA-based GPU acceleration, ensure you have:
- NVIDIA GPU with CUDA support
- CUDA toolkit installed
- Build with the `cuda` feature flag:

```bash
maturin develop --release --features cuda
```

## R Package

### 1. Install R

Download and install R from [CRAN](https://cran.r-project.org/).

### 2. Install Dependencies and Package

```r
# Install CRAN dependencies
install.packages(c("doSNOW", "foreach", "snow", "doRNG", "gtools",
                    "glmnet", "pROC", "viridis", "kernlab",
                    "randomForest", "effsize"))

# Install Bioconductor dependency
if (!requireNamespace("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
BiocManager::install("BioQC")

# Install predomicspkg from GitHub
devtools::install_github("predomics/predomicspkg")
```

### 3. Verify Installation

```r
library(predomics)
# Should load without errors
```

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Disk | 2 GB | 10+ GB (for datasets) |
| Docker | 20.10+ | Latest |
| Python | 3.9+ | 3.11+ |
| R | 4.0+ | 4.3+ |
| Rust | 1.70+ | Latest stable |
