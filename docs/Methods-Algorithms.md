---
layout: default
title: Search Algorithms
parent: Methods
nav_order: 2
---

# Search Algorithms

Predomics provides three complementary optimization algorithms for searching the model space. Each explores different trade-offs between exhaustiveness, speed, and stochasticity.

## Genetic Algorithm (GA)

The primary search strategy. A population-based evolutionary algorithm that maintains and evolves a diverse set of candidate models over multiple generations (epochs).

### Algorithm Outline

1. **Initialization**: Generate a random population of individuals, each with a random subset of k features and random coefficients (drawn from the language alphabet). Feature `prior_weight` annotations can bias initial feature selection.

2. **Evaluation**: Score each individual on the training data (compute AUC, optimize threshold, apply penalties).

3. **Selection**: Choose parents for the next generation:
   - **Elite selection**: Top-performing individuals survive unchanged
   - **Niche selection** (`select_niche_pct`): Within each language x data-type niche, the top N% are guaranteed as parents. This prevents any single niche from dominating.
   - **Tournament/random selection**: Fill remaining parent slots

4. **Crossover**: Combine pairs of parent models to produce offspring. Feature sets are recombined (union, intersection, or mixed strategies). Coefficients are inherited or re-assigned.

5. **Mutation**: Randomly modify offspring:
   - Add or remove a feature
   - Flip a coefficient sign
   - Change the language or data type (rare, large mutations)

6. **Diversity filtration** (`forced_diversity_pct`): At periodic intervals (`forced_diversity_epochs`), remove individuals that are too similar to others (measured by signed Jaccard distance on feature sets). Binary/Ternary/Pow2 models are filtered as one group; Ratio models are filtered separately. This prevents premature convergence.

7. **Repeat** steps 2-6 for the configured number of epochs.

### Niche System

The population is partitioned into **niches** based on (language, data_type) combinations. For example, with languages {bin, ter, ratio} and data types {raw, prev, log}, there are up to 9 niches. The `select_niche_pct` parameter ensures each niche contributes parents to the next generation, maintaining structural diversity.

### When to Use

- **Default choice** for most analyses
- Best for broad exploration of the feature space
- Handles all languages and data types simultaneously
- Most robust to local optima due to population diversity

## Beam Search

A deterministic, greedy heuristic that builds models incrementally.

### Algorithm Outline

1. Start with empty model (k=0)
2. For each candidate feature, tentatively add it to the model
3. Score all (current model + 1 feature) combinations
4. Keep the top B candidates (beam width)
5. Repeat until reaching the target model size k
6. Optionally, continue with **backward elimination**: try removing each feature and keep the best

### Variants

- **Limited Exhaustive**: Evaluate all subsets up to size k (exponential, only practical for small k and feature sets)
- **Parallel Forward Selection**: Multiple starting points explored in parallel

### When to Use

- **Fast prototyping**: Deterministic and reproducible
- **Small feature sets**: When the filtered feature space is small enough for near-exhaustive search
- **Benchmark**: Compare GA results against a greedy baseline
- **Reproducibility**: Same input always produces the same output (no stochasticity)

### Limitations

- Can get trapped in local optima (greedy decisions are irreversible)
- Does not naturally explore multiple languages/data types simultaneously
- Less effective when feature interactions are complex

## MCMC (Markov Chain Monte Carlo)

A probabilistic sampler that explores the model space through random walks.

### Algorithm Outline

1. Start with a random model
2. **Propose** a modification:
   - Add a random feature
   - Remove a random feature
   - Swap a feature for another
   - Change a coefficient
3. **Accept or reject** the proposal based on the Metropolis-Hastings criterion:
   - If the new model is better: always accept
   - If worse: accept with probability proportional to exp(-delta_fitness / temperature)
4. Record the current model
5. Repeat for many iterations

### Sequential Backward Selection Variant

A deterministic variant that starts with a large feature set and iteratively removes the least important feature (by MDA permutation), producing models at each sparsity level.

### When to Use

- **Posterior estimation**: Estimate the probability that each feature belongs to the optimal model
- **Uncertainty quantification**: The chain samples proportional to model quality
- **Complementary exploration**: Can find models missed by GA and Beam

## Algorithm Comparison

| Property | GA | Beam | MCMC |
|----------|:--:|:----:|:----:|
| Stochastic | Yes | No | Yes |
| Multi-language | Yes | Per-run | Per-run |
| Global search | Strong | Weak | Moderate |
| Speed | Moderate | Fast | Slow |
| Reproducibility | Seed-dependent | Deterministic | Seed-dependent |
| Feature interactions | Captured | Limited | Moderate |
| Recommended for | General use | Quick exploration | Posterior estimation |

## Cross-Validation

All algorithms support two levels of cross-validation:

### Outer Cross-Validation (K-Fold)

The training data is split into K folds (default K=5). The algorithm is run K times in parallel, each time using K-1 folds for training and 1 fold for validation. The final population gathers the Family of Best Models (FBM) from all folds.

```
Fold 1: Train on folds {2,3,4,5}, validate on fold 1
Fold 2: Train on folds {1,3,4,5}, validate on fold 2
...
Final: Combine FBMs, evaluate on full training data + external test set
```

### Inner Cross-Validation (Overfit Control)

Within each training run, the data is further split into inner folds. At each epoch, model fitness is penalized for the train-validation gap:

```
fitness = mean(train_fit - |train_fit - valid_fit| * overfit_penalty)
```

Inner folds can be re-drawn periodically (`resampling_inner_folds_epochs`) to prevent indirect learning of fold structure.

### Stratification

Folds are stratified by class label to preserve class proportions. Since v0.7.4, **double stratification** is supported: folds are stratified first by class, then by a metadata variable (e.g., hospital, batch, sequencing center) to ensure that confounding factors are balanced across folds.

## Feature Pre-selection

Before running any algorithm, features are statistically pre-filtered to reduce the search space:

1. **Prevalence filter** (`feature_minimal_prevalence_pct`): Remove features present in fewer than N% of samples in both classes
2. **Mean filter** (`feature_minimal_feature_value`): Remove features with negligible mean abundance in both classes
3. **Statistical test**: Three options:
   - **Wilcoxon rank-sum** (default): Non-parametric, robust to skewness and outliers
   - **Student's t-test**: Parametric, assumes normality
   - **Bayesian Fisher's exact**: For binary/presence-absence data, uses Bayes factors
4. **Multiple testing correction**: Benjamini-Hochberg FDR for Wilcoxon and t-test
5. **Feature ranking**: Features ranked by significance, optionally capped at `max_features_per_class` per class

## References

- Holland, J. H. (1992). *Adaptation in Natural and Artificial Systems*. MIT Press.
- Blondel, V. D. et al. (2008). Fast unfolding of communities in large networks. *J. Stat. Mech.*, P10008.
- Metropolis, N. et al. (1953). Equation of state calculations by fast computing machines. *J. Chem. Phys.*, 21(6), 1087-1092.
