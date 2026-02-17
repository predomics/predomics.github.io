---
layout: default
title: Features
nav_order: 3
---

# Features

## Model Languages

Predomics discovers classification signatures using three interpretable mathematical languages:

- **Binary (bin)** -- Features contribute as 0 or 1 (presence/absence). The score is a simple sum of selected feature values above their individual thresholds.
- **Ternary (ter)** -- Features contribute as -1, 0, or +1. Features enriched in one class contribute positively; features enriched in the other contribute negatively. The most commonly used language.
- **Ratio** -- The score is computed as the ratio of two feature groups (numerator sum / denominator sum). Naturally bounded and robust to normalization differences.

All languages produce compact, human-readable models with typically 3--15 features (parameter `k`), making them ideal for biomarker discovery.

## Search Algorithms

Three complementary optimization strategies are available:

- **Genetic Algorithm (GA)** -- Population-based evolutionary search. Maintains a diverse population of candidate models, iteratively applying crossover, mutation, and selection to converge toward high-fitness signatures. Best for broad exploration of the feature space.
- **Beam Search** -- Deterministic, greedy heuristic that incrementally builds signatures by adding the best feature at each step. Fast and reproducible, well-suited for small feature sets and quick exploration.
- **MCMC (Bayesian)** -- Markov Chain Monte Carlo sampler that explores the model space probabilistically. Useful for estimating posterior distributions of feature inclusion probabilities.

Each algorithm can be combined with any model language and run independently or in batch mode to sweep across parameter combinations.

## Family of Best Models (FBM)

Rather than selecting a single "best" model, Predomics tracks the **Family of Best Models** -- all individuals that achieve near-optimal performance. This population provides:

- Feature prevalence analysis: identify which features appear most consistently across top models
- Robustness assessment: stable features (high prevalence) are more likely to generalize
- Functional annotations: link features to known biological functions (butyrate production, inflammation, transit time, oral origin)
- Co-presence analysis: detect feature pairs that co-occur or exclude each other significantly
- **Stability analysis**: Kuncheva, Tanimoto, and weighted consistency indices per sparsity level to identify the "sweet spot" where models are both performant and stable
- **Model clustering**: hierarchical clustering (Tanimoto distance) reveals distinct model families and prototype representatives
- **Feature × sparsity heatmap**: feature prevalence across model sizes reveals the "core signature" that persists regardless of k

## Jury / Ensemble Voting

Build an ensemble of expert models from the best individuals across generations:

- **Majority voting** -- Weighted expert consensus with configurable threshold
- **Consensus voting** -- Requires minimum agreement level to predict; uncertain samples are rejected
- **Rejection class** -- Samples below confidence threshold are assigned to class 2 (abstention), reducing false positives
- Per-sample vote matrix visualization and concordance analysis
- Comparison of jury performance vs. best individual model

## Evaluation & Metrics

- **K-fold cross-validation** with nested inner/outer folds and overfit penalty control
- **Holdout validation** with configurable train/test split ratio
- **External validation** on independent cohorts uploaded post-training
- Metrics: AUC, accuracy, sensitivity, specificity, MCC, F1 score
- Confusion matrices with rejection class support (3x2 layout)
- Generation-level tracking of train vs. test AUC evolution

## Feature Importance

- **MDA (Mean Decrease in Accuracy)** -- Permutation-based importance via random shuffling of each feature
- **SHAP-like explanations** -- Per-sample feature contribution breakdown (feature value x coefficient)
  - Beeswarm plot: distribution of SHAP values across all samples
  - Force plot: per-sample waterfall of feature contributions
  - Dependence plot: SHAP value vs. feature value for a selected feature
- **Coefficient direction** -- Bar chart of model coefficients showing which features push toward which class
- **Waterfall chart** -- Feature contribution decomposition for the best model

## Ecosystem Analysis

Visualize and explore microbial ecosystems as co-abundance networks, inspired by the Interpred approach (Cousin-Thorez, 2019) and the SCAPIS ecosystem work (Prifti, 2024).

- **Co-abundance network** -- Species correlation network built from the abundance matrix using pairwise Spearman correlations. Edges connect species with |rho| above a configurable threshold.
- **Community detection** -- Louvain algorithm partitions the network into ecological modules (niches). Modularity score quantifies partition quality.
- **Taxonomic coloring** -- Hierarchical color scheme: phylum base colors (SCAPIS palette) with family-level shading via lighten/darken gradients. Produces visually distinct colors for every family within each phylum.
- **Multiple layout algorithms** -- Organic (Fruchterman-Reingold with simulated annealing), Force-directed, Circle, and Radial layouts.
- **Three color modes** -- Taxonomy (phylum/family), Module (Louvain community), or Enrichment (which class each species is enriched in).
- **FBM overlay** -- Annotate network nodes with data from the Family of Best Models: prevalence of each species across models and dominant coefficient direction (+1/-1). Bridges the ecological view with the predictive view.
- **Interactive controls** -- Adjustable prevalence threshold, correlation threshold, class filtering (all/class 0/class 1), and module highlight on click.
- **Node metrics** -- Degree, betweenness centrality, per-class prevalence, mean abundance.

## Web Application (PredomicsApp)

The web application provides a complete analysis workflow:

- **Project management** -- Create, archive, share, and organize analysis projects
- **Dataset library** -- Centralized dataset management with versioning, tagging, and metadata scanning
- **Data exploration** -- Feature statistics, prevalence distribution, volcano plots, barcode visualization
- **Parameter configuration** -- Template system, admin defaults, batch mode for sweeping parameters
- **Real-time monitoring** -- Live console output with progress sparkline during job execution
- **Interactive results** -- Plotly-based charts for all result views (summary, population, jury, comparative, co-presence, ecosystem)
- **Export options** -- PDF biomarker reports, HTML reports, CSV tables, Python notebooks (.ipynb), R notebooks (.Rmd)
- **Prediction API** -- Deploy trained models as REST endpoints for programmatic scoring
- **User management** -- JWT authentication, API keys, role-based access (admin, viewer, editor)
- **Public sharing** -- Generate read-only links with optional expiry dates
- **Browser notifications** -- Desktop alerts when jobs complete or fail
- **Multi-cohort meta-analysis** -- Compare models across datasets to identify shared biomarkers
