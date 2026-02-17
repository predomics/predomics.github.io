---
layout: default
title: Family of Best Models
parent: Methods
nav_order: 3
---

# Family of Best Models (FBM)

Rather than selecting a single "best" model, Predomics identifies the **Family of Best Models** -- a statistically defined population of all models whose performance is not significantly worse than the best.

## Definition

Let N models have fitness scores f_1 >= f_2 >= ... >= f_N (sorted descending). The FBM is defined using a **binomial confidence interval** around the best score f_1:

```
lower_bound = BinomialCI(f_1, N, alpha)
FBM = { model_i : f_i > lower_bound }
```

where alpha is the confidence level (parameter `best_models_criterion`). A smaller alpha produces a larger FBM (more permissive).

If the fitness metric is not in [0, 1], a fallback criterion selects the top 5% of models.

## Why a Family, Not a Single Model?

1. **Statistical equivalence**: Many models may perform equally well within sampling noise. Selecting only the top model ignores this uncertainty.
2. **Feature robustness**: Features appearing in many FBM models (high prevalence) are more reliable biomarkers than features appearing in only the top model.
3. **Biological insight**: The diversity of models in the FBM reveals which features are interchangeable and which are essential.
4. **Ensemble prediction**: The FBM provides a natural ensemble for jury/voting-based prediction.

## FBM Analysis in PredomicsApp

### Feature Prevalence

For each feature, its **FBM prevalence** is the fraction of FBM models that include it:

```
prevalence(feature_j) = count(models containing feature_j) / |FBM|
```

Features with prevalence > 80% are likely core biomarkers. Features with prevalence 20-80% may be interchangeable alternatives. Features with prevalence < 20% are accessory or context-dependent.

### Population Heatmap

The FBM population is visualized as a heatmap:
- **Rows**: Models (sorted by fitness or language)
- **Columns**: Features (sorted by prevalence)
- **Color**: Coefficient value (+1 blue, -1 red, 0 white)

This reveals which features co-occur, which are mutually exclusive, and whether distinct model families exist.

### Co-Presence Analysis

Feature **co-presence** measures how often two features appear together in FBM models compared to chance:

1. For each feature pair (A, B), count:
   - Both present: n_AB
   - Only A: n_A - n_AB
   - Only B: n_B - n_AB
   - Neither: N - n_A - n_B + n_AB

2. Apply the **hypergeometric test** (Fisher's exact test) to assess significance
3. Features that co-occur more than expected are positively associated (potential functional modules)
4. Features that co-occur less than expected may be functionally redundant (interchangeable)

### FBM Z-Score Filtering

The FBM can be further filtered using a **z-score criterion** to focus on models whose performance is within a statistical threshold of the mean:

```
z_i = (f_i - mean(FBM)) / std(FBM)
```

Models with z_i below a configurable threshold are excluded. This produces a tighter "core FBM" while still being more robust than single-model selection.

## Jury / Ensemble Voting

The FBM naturally produces an ensemble of expert models for prediction:

### Majority Voting

Each FBM model independently predicts the class of a new sample. The final prediction is the majority vote, optionally weighted by model fitness:

```
prediction = argmax( sum(w_i * vote_i) for class in {0, 1} )
```

where w_i is the weight of model i (e.g., its AUC).

### Consensus Voting

Requires a minimum agreement level (e.g., 70% of experts) to make a prediction. If agreement is below the threshold, the sample is classified as "undecided" (rejection):

```
if max(agreement_0, agreement_1) < consensus_threshold:
    prediction = "rejected"
else:
    prediction = argmax(agreement_0, agreement_1)
```

### Vote Matrix

A detailed per-sample, per-model matrix showing how each expert voted on each sample. This allows identification of:
- **Unanimous samples**: All experts agree (high confidence)
- **Controversial samples**: Experts disagree (potentially misclassified or atypical)
- **Expert groups**: Clusters of models that vote similarly

### Concordance Analysis

Measures pairwise agreement between jury experts:
- **Cohen's kappa** between model pairs
- **Overall concordance**: Fraction of samples where all experts agree
- **Confusion matrix** for the jury ensemble vs. true labels

## References

- Prifti, E. et al. (2020). Interpretable and accurate prediction scores for metagenomics data with Predomics. *GigaScience*, 9(3).
- Cui, S. (2017). Mining sparse statistical learning models. Internship report, Ecole Polytechnique / ICAN.
