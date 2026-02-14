---
layout: default
title: Features
parent: Documentation
nav_order: 3
---

# Features

## Model Languages
- **Binary (bin)** -- Features contribute as 0 or 1 (presence/absence)
- **Ternary (ter)** -- Features contribute as -1, 0, or +1 (direction matters)
- **Ratio** -- Score is computed as a ratio of two feature groups

## Search Algorithms
- **Genetic Algorithm (GA)** -- Population-based evolutionary search with crossover, mutation, and selection
- **Beam Search** -- Deterministic heuristic that grows signatures incrementally
- **Data-driven (Da)** -- Analytical approach for optimal feature selection

## Jury / Ensemble Voting
- Build an ensemble of expert models from the best individuals across generations
- **Majority voting** -- Weighted expert consensus with configurable threshold
- **Consensus voting** -- Requires minimum agreement level to predict
- **Rejection** -- Samples below confidence threshold are abstained (class 2)
- Per-sample vote matrix visualization and concordance analysis

## Evaluation
- K-fold cross-validation with AUC, accuracy, sensitivity, specificity
- Train/test split with independent evaluation
- Confusion matrices with rejection class support
- Feature importance ranking via permutation

## Web Application
- Project and dataset management with user authentication
- Parameter configuration with admin-level defaults
- Job queue with real-time progress monitoring
- Interactive results: heatmaps, violin plots, generation tracking, population explorer
- Jury visualization: concordance charts, sample predictions, vote matrix heatmap
- Project sharing between users (viewer/editor roles)
