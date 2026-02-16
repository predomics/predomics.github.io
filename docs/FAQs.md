---
layout: default
title: FAQs
parent: Documentation
nav_order: 7
---

# Frequently Asked Questions

### How do I install Predomics?

Please refer to the [Installation](Installation.html) guide. The quickest method is Docker: `docker compose up -d` gets the web app running in minutes.

### What data formats are supported?

PredomicsApp accepts **TSV** and **CSV** files. The standard format has features in rows and samples in columns (gpredomics convention), but you can toggle "features in rows" if your data is transposed. The X matrix contains feature values and the Y vector contains binary class labels (0/1).

### How many features can Predomics handle?

The Rust engine can handle matrices with thousands of features and hundreds of samples efficiently. Typical metagenomic datasets (200--2000 species, 50--500 samples) run in seconds to minutes depending on the algorithm and parameter settings.

### What is the "Family of Best Models" (FBM)?

Rather than outputting a single best model, Predomics tracks all models that achieve near-optimal performance throughout the evolutionary search. This population of top performers reveals which features are consistently selected (high prevalence = robust biomarkers) and which are interchangeable.

### How does jury voting work?

The jury selects the best models from the FBM as "experts". Each expert votes on whether a sample belongs to class 0 or class 1. The final prediction is determined by majority or consensus voting. Samples where experts disagree strongly can be "rejected" (assigned to class 2), reducing false positives at the cost of abstaining on uncertain cases.

### Can I use Predomics without the web app?

Yes. The Python library (`gpredomicspy`) and R package (`predomicspkg`) can be used directly in scripts and notebooks. See the [Usage](Usage.html) guide for code examples.

### What is the difference between GA, Beam, and MCMC?

- **GA (Genetic Algorithm)**: best for broad exploration, may find unexpected feature combinations
- **Beam Search**: fastest, deterministic, good for initial exploration
- **MCMC**: probabilistic sampling, useful for estimating feature inclusion probabilities

In practice, running all three and comparing results gives the most robust analysis.

### How do I validate a model on new data?

In the Results tab, click "Validate on New Data" to upload an independent validation cohort (X matrix and optionally Y labels). The model will score each sample and report AUC, accuracy, and per-sample predictions if labels are provided.

### Can I share results with collaborators?

Yes, in two ways:
1. **User sharing**: Invite collaborators by email with viewer or editor permissions
2. **Public links**: Generate a read-only URL that works without login, with optional expiry dates

### What GPU acceleration is available?

The gpredomics Rust engine supports CUDA-based GPU acceleration for the fitness evaluation step. This is most impactful for large populations and high-dimensional datasets. Enable it in the parameter configuration.

### How do I run batch analyses?

In the Parameters tab, enable "Batch Mode" to sweep across multiple seeds, algorithms, languages, data types, population sizes, epochs, or k_max values. The system generates all combinations and launches them as separate jobs (up to 50 per batch).

### What export formats are available?

- **PDF biomarker report**: Publication-ready document with metrics, feature tables, and configuration
- **HTML report**: Self-contained interactive report
- **CSV files**: Best model, population, generations, jury predictions
- **Python notebook** (.ipynb): Reproducible Jupyter notebook
- **R notebook** (.Rmd): Reproducible R Markdown document
- **Full JSON**: Complete analysis results for programmatic access
