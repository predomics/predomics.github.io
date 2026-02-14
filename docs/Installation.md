---
layout: default
title: Installation
parent: Documentation
nav_order: 2
---

# Installation

## Web Application (Docker)

The fastest way to get started:

```bash
git clone https://github.com/predomics/predomicsapp-web.git
cd predomicsapp-web
docker compose up -d
```

Open [http://localhost:8001](http://localhost:8001) in your browser. Default credentials are created on first launch.

## R Package

1. Install R from [CRAN](https://cran.r-project.org/).
2. Install the package and dependencies:

```r
devtools::install_github("predomics/predomicspkg")

# Install dependencies
install.packages(c("doSNOW", "foreach", "snow", "doRNG", "gtools",
                    "glmnet", "pROC", "viridis", "kernlab",
                    "randomForest", "effsize"))

if (!requireNamespace("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
BiocManager::install("BioQC")
```

## Python Bindings (gpredomicspy)

Requires Rust toolchain for compilation:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Clone and build
git clone https://github.com/predomics/gpredomics.git
git clone https://github.com/predomics/gpredomicspy.git
cd gpredomicspy
pip install maturin
maturin develop --release
```
