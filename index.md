---
layout: default
title: Home
nav_order: 0
---

<p align="center">
  <img src="/docs/logo.png" alt="Predomics" width="200" />
</p>

# Predomics
{: .fs-9 .text-center }

**Predictive Models from Omics Data**
{: .fs-6 .fw-300 .text-center }

Predomics is an open-source suite for building interpretable, parsimonious classification models from high-dimensional omics data (metagenomics, transcriptomics, metabolomics). It uses evolutionary algorithms (genetic algorithms, beam search) to discover minimal-feature signatures that discriminate between biological conditions.
{: .fs-5 .fw-300 }

[Get Started](#getting-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on GitHub](https://github.com/predomics){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Key Features

| Feature | Description |
|:--------|:------------|
| **Parsimonious Models** | Discovers minimal feature sets (binary, ternary, ratio) that achieve high classification accuracy |
| **Multiple Languages** | Binary (0/1), ternary (-1/0/+1), and ratio-based model representations |
| **Jury Voting** | Ensemble of expert models with majority/consensus voting and rejection capability |
| **Evolutionary Search** | Genetic algorithms (GA) and beam search heuristics for feature selection |
| **Interpretability** | Models are simple enough to be understood and validated by domain experts |
| **Cross-validation** | Built-in k-fold cross-validation with generation-level tracking |

## The Predomics Suite

### gpredomics (Rust)
High-performance ML engine written in Rust. Runs evolutionary algorithms at native speed with Python bindings via `gpredomicspy`.

[Repository](https://github.com/predomics/gpredomics){: .btn .btn-outline }

### PredomicsApp (Web)
Full-stack web application (FastAPI + Vue.js 3) for running analyses, exploring results, and managing projects. Deployable via Docker.

[Repository](https://github.com/predomics/predomicsapp-web){: .btn .btn-outline }

### predomicspkg (R)
The original R package with the complete algorithm implementations, visualization tools, and data analysis utilities.

[Repository](https://github.com/predomics/predomicspkg){: .btn .btn-outline }

---

## Getting Started

### Quick Start with Docker (Web Application)

```bash
git clone https://github.com/predomics/predomicsapp-web.git
cd predomicsapp-web
docker compose up -d
```

Then open [http://localhost:8001](http://localhost:8001) in your browser.

### R Package Installation

```r
# Install from GitHub
devtools::install_github("predomics/predomicspkg")

library(predomics)
```

### Python Bindings (gpredomicspy)

```python
import gpredomicspy

param = gpredomicspy.Param()
param.load("params.yaml")
experiment = gpredomicspy.fit(param)
experiment.display_results()
```

---

## Publications

- Prifti E. et al. *Interpretable and accurate prediction scores for metagenomics data using a ternary encoding approach.* GigaScience, 2020.

---

## Contact

- **Edi Prifti** - [edi.prifti@ird.fr](mailto:edi.prifti@ird.fr)
- GitHub Issues: [predomicspkg](https://github.com/predomics/predomicspkg/issues) | [predomicsapp-web](https://github.com/predomics/predomicsapp-web/issues) | [gpredomics](https://github.com/predomics/gpredomics/issues)
