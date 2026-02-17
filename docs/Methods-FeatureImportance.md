---
layout: default
title: Feature Importance & Evaluation
parent: Methods
nav_order: 6
---

# Feature Importance & Evaluation

Predomics provides multiple methods for assessing feature importance and evaluating model performance, from individual feature contributions to population-level prevalence analysis.

## Individual Feature Importance

### Mean Decrease in Accuracy (MDA)

MDA is a **permutation-based** importance metric that measures how much each feature contributes to the model's predictive power:

1. Compute the baseline AUC of the model on the test data
2. For each feature j in the model:
   a. Randomly shuffle the values of feature j across samples (N permutations, default N=100)
   b. Recompute the AUC on the shuffled data
   c. MDA(j) = mean(baseline_AUC - shuffled_AUC)
3. Features with high MDA are critical; removing them destroys predictive accuracy

**Interpretation:**
- **MDA > 0**: Feature contributes positively to the model
- **MDA ~ 0**: Feature is irrelevant or redundant (its information is captured by other features)
- **MDA < 0**: Feature may be adding noise (rare, but possible)

**Limitations:**
- MDA evaluates each feature **independently** -- it cannot capture feature interactions
- If two features are highly correlated, shuffling one may not decrease AUC because the other compensates
- MDA is used internally for feature **pruning**: features with zero or negative importance can be automatically removed to simplify the model

### SHAP-like Per-Sample Explanations

For each sample, the contribution of each feature to the predicted score is decomposed:

```
contribution(feature_j, sample_s) = coefficient_j * value(feature_j, sample_s)
```

This provides a per-sample, per-feature breakdown of the prediction, enabling:

#### Beeswarm Plot
- Each dot represents one sample's SHAP value for one feature
- X-axis: SHAP value (contribution to score)
- Y-axis: Features (sorted by overall importance)
- Color: Feature value (low = blue, high = red)

Reveals the **direction** of each feature's effect: high values of feature X push toward disease (positive SHAP, red dots on right) or health (positive SHAP, blue dots on right).

#### Force Plot (Waterfall)
- For a selected sample, shows the sequential contribution of each feature
- Starting from a base value, each feature pushes the score up or down
- The final score determines the classification

Useful for explaining **individual predictions**: "This patient was classified as disease because feature A was high (+0.3), feature B was present (+0.2), despite feature C being low (-0.1)."

#### Dependence Plot
- X-axis: Feature value
- Y-axis: SHAP value for that feature
- One dot per sample

Reveals **non-linear** relationships between feature values and their contribution to the model. A flat line means the feature's effect is constant; a curve means the effect changes with abundance.

### Coefficient Direction

A simpler importance view that shows the model's coefficients directly:
- **Positive coefficients** (+1, or higher in Pow2): Feature enriched in class 1 (disease)
- **Negative coefficients** (-1, or lower in Pow2): Feature enriched in class 0 (controls)

The coefficient direction chart provides an immediate visual summary of which features push toward which class.

## Population-Level Feature Analysis

### Feature Prevalence in the FBM

For each feature, its prevalence across the Family of Best Models measures its **consistency as a biomarker**:

```
prevalence(feature_j) = count(FBM models containing feature_j) / |FBM|
```

Features are ranked by prevalence and displayed as:
- **Prevalence bar chart**: Horizontal bars showing prevalence per feature
- **Population heatmap**: Models (rows) x features (columns), colored by coefficient

### FBM Feature Categories

| Prevalence | Category | Interpretation |
|------------|----------|---------------|
| > 80% | Core biomarker | Almost always selected. Very robust signal. |
| 50-80% | Frequent biomarker | Selected in most models. Reliable but may have alternatives. |
| 20-50% | Accessory feature | Selected in some models. May be context-dependent or interchangeable. |
| < 20% | Rare feature | Only in a few models. Possibly noise or specific to certain k values. |

### Feature x Sparsity Heatmap

Shows how feature prevalence varies across model sizes k:
- A feature with high prevalence at k=3 and k=5 but low at k=10 is a **core feature** that gets diluted at higher sparsity
- A feature with increasing prevalence as k grows is **secondary** -- only included when the model has room for extra features

## Evaluation Metrics

### Classification Metrics

| Metric | Formula | Range | Interpretation |
|--------|---------|-------|---------------|
| **AUC** | Area under ROC | [0.5, 1] | Discrimination ability across all thresholds |
| **Accuracy** | (TP+TN) / N | [0, 1] | Overall correctness (affected by class imbalance) |
| **Sensitivity** | TP / (TP+FN) | [0, 1] | Ability to detect positives (recall) |
| **Specificity** | TN / (TN+FP) | [0, 1] | Ability to detect negatives |
| **MCC** | (TP*TN-FP*FN) / sqrt(...) | [-1, 1] | Balanced metric, robust to class imbalance |
| **F1 Score** | 2*Prec*Sens / (Prec+Sens) | [0, 1] | Harmonic mean of precision and sensitivity |
| **G-mean** | sqrt(Sens * Spec) | [0, 1] | Geometric mean, penalizes imbalanced performance |

### Confusion Matrix

The standard 2x2 confusion matrix is extended with a **rejection class** when threshold confidence intervals are enabled:

|  | Predicted 0 | Predicted 1 | Rejected |
|--|:-----------:|:-----------:|:--------:|
| **Actual 0** | TN | FP | Rejected-0 |
| **Actual 1** | FN | TP | Rejected-1 |

Rejected samples have scores falling within the threshold confidence interval.

### Cross-Validation Reporting

Performance is reported at multiple levels:
- **Per-fold**: Train and validation metrics for each outer CV fold
- **Aggregated**: Mean and standard deviation across folds
- **Final**: Performance of the combined FBM on full training data
- **External test**: Performance on held-out test data (if provided)

### Generation Tracking

During GA optimization, train and test AUC are tracked at each generation to detect:
- **Convergence**: AUC stabilizes (good stopping criterion)
- **Overfitting**: Train AUC increases but test AUC decreases or stagnates
- **Underfitting**: Both train and test AUC are low (need more epochs or different parameters)

## External Validation

Models trained on one dataset can be validated on an independent cohort:

1. Upload external Xtest and Ytest files
2. Apply the best model (or jury ensemble) to the new data
3. Compare AUC, sensitivity, specificity on the external cohort

This is the gold standard for assessing generalization and is essential before claiming clinical utility.

## Multi-Cohort Meta-Analysis

The comparative/meta-analysis view allows side-by-side comparison of multiple jobs:

- **Overlaid metrics**: AUC, accuracy, sensitivity across different runs
- **Feature overlap**: Venn diagram of features selected by different runs
- **Cross-cohort biomarkers**: Features consistently selected across datasets are the strongest candidates for generalization

## References

- Breiman, L. (2001). Random Forests. *Machine Learning*, 45(1), 5-32. (Original MDA formulation)
- Lundberg, S. M. & Lee, S.-I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.
- Matthews, B. W. (1975). Comparison of the predicted and observed secondary structure of T4 phage lysozyme. *Biochimica et Biophysica Acta*, 405(2), 442-451.
