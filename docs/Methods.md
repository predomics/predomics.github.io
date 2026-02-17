---
layout: default
title: Methods
nav_order: 2
has_children: true
---

# Methods

Detailed descriptions of the algorithms and statistical methods behind Predomics.

## Overview

Predomics combines compact mathematical model languages with evolutionary optimization to discover interpretable predictive signatures from high-dimensional omics data. The methods span four key areas:

### [Model Languages & Scoring](Methods-ModelLanguages.md)
The four model languages (Binary, Ternary, Ratio, Pow2), data type transformations (raw, prevalence, log), threshold optimization, confidence intervals, fitness functions and penalties.

### [Search Algorithms](Methods-Algorithms.md)
The three optimization strategies (Genetic Algorithm, Beam Search, MCMC), cross-validation schemes (outer and inner folds, stratification), and feature pre-selection methods (Wilcoxon, t-test, Bayesian Fisher).

### [Family of Best Models](Methods-FBM.md)
The statistical definition of the FBM (binomial CI), feature prevalence analysis, co-presence testing (hypergeometric), z-score filtering, and jury/ensemble voting (majority, consensus, rejection).

### [Stability Analysis](Methods-Stability.md)
Three stability indices (Tanimoto, Kuncheva, CW_rel) computed per sparsity level, hierarchical model clustering (Tanimoto distance, average linkage), feature x sparsity heatmaps, and dendrogram visualization. Inspired by the Shasha Cui internship (2017).

### [Ecosystem Network](Methods-Ecosystem.md)
Co-abundance network construction (Spearman correlation, prevalence filtering), Louvain community detection, taxonomic coloring (SCAPIS palette), node metrics (degree, betweenness), FBM overlay, and class-specific networks. Inspired by Interpred (2019) and SCAPIS ecosystem work (2024).

### [Feature Importance & Evaluation](Methods-FeatureImportance.md)
MDA permutation importance, SHAP-like per-sample explanations (beeswarm, force, dependence), population-level feature prevalence, evaluation metrics (AUC, MCC, F1, G-mean), cross-validation reporting, and external validation.

## Key References

- Prifti, E. et al. (2020). Interpretable and accurate prediction scores for metagenomics data. *GigaScience*, 9(3). [doi:10.1093/gigascience/giaa010](https://doi.org/10.1093/gigascience/giaa010)
- Kuncheva, L. I. (2007). A stability index for feature selection. *IASTED*, 390-395.
- Blondel, V. D. et al. (2008). Fast unfolding of communities in large networks. *J. Stat. Mech.*, P10008.
- Efron, B. & Tibshirani, R. J. (1993). *An Introduction to the Bootstrap*. Chapman & Hall/CRC.
