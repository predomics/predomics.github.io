---
layout: default
title: Model Languages & Scoring
parent: Methods
nav_order: 1
---

# Model Languages & Scoring

Predomics discovers classification signatures using compact mathematical languages. Each model is defined by a subset of features, their coefficients, and a decision threshold. This design produces models that are both interpretable and clinically actionable.

## Model Languages (BTR + Pow2)

Predomics defines four model languages, each encoding a different type of ecological relationship between features. The original three (Binary, Ternary, Ratio) are collectively called **BTR** [Prifti et al., 2020](https://doi.org/10.1093/gigascience/giaa010).

### Binary -- Cooperation / Cumulative Effect

**Coefficients:** C_i in {0, 1}

```
Score = C_1 * F_1 + C_2 * F_2 + ... + C_k * F_k >= threshold
```

Selected features contribute their raw values equally. This language captures **cumulative presence** -- the more selected features are present or abundant, the higher the score. Analogous to ecological cooperation, where multiple species jointly contribute to a phenotype.

**Use case:** When disease is associated with the combined presence of multiple taxa (e.g., oral bacteria accumulating in the gut).

### Ternary -- Competition / Predation

**Coefficients:** C_i in {-1, 0, +1}

```
Score = (L + U + X) - (D + A + R + K) >= threshold
```

Features enriched in one class contribute positively (+1); features enriched in the other contribute negatively (-1). This language captures **antagonistic relationships** -- features that increase vs. decrease with disease.

**Use case:** The most commonly used language. Captures biomarker signatures where some species increase while others decrease (e.g., butyrate producers depleted, pathobionts enriched in disease).

### Ratio -- Imbalance

**Coefficients:** C_i in {-1, 0, +1}

```
Score = (L + U + X) / (D + A + R + K + epsilon) >= threshold
```

The score is the ratio of positively-weighted features over negatively-weighted features. Naturally bounded (0 to infinity) and robust to normalization differences between cohorts.

**Use case:** When the relative balance between two groups of species matters more than absolute abundances. Particularly useful for cross-cohort generalization.

### Pow2 -- Weighted Ternary

**Coefficients:** C_i in {-64, -32, -16, -8, -4, -2, -1, 0, 1, 2, 4, 8, 16, 32, 64}

```
Score = 1*L + 2*U + 4*X - (64*D + 4*A + 2*R + 1*K) >= threshold
```

An extension of Ternary that allows features to have different contribution weights, using powers of two for computational efficiency. Introduced in gpredomics to capture features with stronger or weaker effects.

**Use case:** When some features are known to have much larger effect sizes than others (e.g., a keystone species vs. a minor contributor).

## Data Type Transformations

Each model language can be combined with three data type transformations, applied to feature values before scoring:

| Data Type | Transformation | Equation (Binary example) | When to use |
|-----------|---------------|--------------------------|-------------|
| **raw** | No transformation | Sum(C_i * F_i) >= threshold | Default. Continuous abundance data. |
| **prev** | Binarize to presence/absence | Sum(C_i * I(F_i > epsilon)) >= threshold | When presence matters more than abundance. Sparse data. |
| **log** | Natural logarithm | Sum(C_i * (ln F_i - ln epsilon)) >= threshold | Right-skewed distributions (typical in metagenomics). Compresses dynamic range. |

The epsilon constant (default 1e-5, configurable via `datatype_epsilon`) prevents division by zero and logarithm of zero.

The combination of 4 languages x 3 data types yields up to **12 model niches**, each exploring different ecological hypotheses.

## Threshold Optimization

After computing the score for all samples, the decision threshold is optimized to maximize classification performance:

- **For AUC:** The threshold maximizing **Youden's index** (Specificity + Sensitivity - 1) is selected. This is the point on the ROC curve farthest from the diagonal.

- **For asymmetric targets** (e.g., prioritizing sensitivity): The threshold maximizes:

  ```
  (target_metric + antagonist_metric * fr_penalty) / (1 + fr_penalty)
  ```

  where `fr_penalty` controls the trade-off between the target and its antagonist.

- **For other metrics:** The threshold directly maximizing the chosen metric (MCC, F1, G-mean) is used.

### Threshold Confidence Interval

For clinical applications requiring uncertainty quantification, gpredomics (v0.7.3+) can compute a **bootstrap confidence interval** around the decision threshold:

1. **Stratified bootstrap**: Resample the training data B times (default B >= 1000), preserving class proportions
2. **Threshold distribution**: Compute the optimal threshold on each bootstrap replicate
3. **Percentile CI**: Extract lower and upper bounds at quantiles alpha/2 and 1-alpha/2
4. **Rejection zone**: Samples with scores between the CI bounds are classified as "undecided" (rejection class 2)

When subsampling is used (`threshold_ci_frac_bootstrap < 1.0`), **Geyer rescaling** corrects for the underestimation of variability inherent in subsampling.

The **rejection rate** (fraction of undecided samples) is used as a penalty during optimization (`threshold_ci_penalty`), favoring models that are more decisive.

## Fitness Function

Model fitness combines a performance metric with optional penalties:

```
fitness = performance_metric - sum(penalties)
```

### Performance Metrics

| Metric | Formula | Best for |
|--------|---------|----------|
| **AUC** | Area under ROC curve | General purpose, class-imbalance robust |
| **Sensitivity** | TP / (TP + FN) | Minimizing false negatives |
| **Specificity** | TN / (TN + FP) | Minimizing false positives |
| **G-mean** | sqrt(Sensitivity * Specificity) | Balanced performance on imbalanced data |
| **MCC** | (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN)) | Imbalanced datasets |
| **F1** | 2 * Precision * Sensitivity / (Precision + Sensitivity) | When precision and recall both matter |

### Fit Penalties

| Penalty | Effect | Formula |
|---------|--------|---------|
| **k_penalty** | Favors simpler models | fitness -= k * k_penalty |
| **bias_penalty** | Penalizes imbalanced predictions | fitness -= (1 - bad_metric) * bias_penalty |
| **overfit_penalty** | Penalizes overfitting in CV | fitness -= mean(train-valid gap) * overfit_penalty |
| **threshold_ci_penalty** | Penalizes high rejection rates | fitness -= rejection_rate * threshold_ci_penalty |
| **feature_penalty** | User-defined per-feature cost | fitness -= weighted_mean(feature_penalties) |

## References

- Prifti, E. et al. (2020). Interpretable and accurate prediction scores for metagenomics data with Predomics. *GigaScience*, 9(3). [doi:10.1093/gigascience/giaa010](https://doi.org/10.1093/gigascience/giaa010)
- Efron, B. & Tibshirani, R. J. (1993). *An Introduction to the Bootstrap*. Chapman & Hall/CRC.
