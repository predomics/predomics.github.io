---
layout: default
title: Stability Analysis
parent: Methods
nav_order: 4
---

# Model Stability Analysis

Stability analysis measures how consistently the same features are selected across models at each sparsity level. High stability indicates that the selected features are robust and not dependent on the specific optimization trajectory.

Inspired by the Shasha Cui internship (Ecole Polytechnique / ICAN, 2017) on mining sparse statistical learning models.

## Motivation

When Predomics discovers hundreds of models in the Family of Best Models, a natural question arises: **are these models selecting the same features, or are they finding different, equally good solutions?**

If models at sparsity k=5 consistently select the same 5 features, the signature is **stable** and likely represents a true biological signal. If different models select different features with equal performance, the signature is **unstable** -- the features may be interchangeable, or the signal may be diffuse across many features.

Stability analysis quantifies this by computing three complementary indices across sparsity levels.

## Stability Indices

### Tanimoto Similarity (Kalousis)

The pairwise Tanimoto similarity (also known as Jaccard index for binary sets) between two feature sets A and B:

```
Tanimoto(A, B) = |A intersection B| / |A union B|
```

For a group of models at sparsity level k, the **mean pairwise Tanimoto similarity** is computed:

```
S_tanimoto(k) = mean( Tanimoto(M_i, M_j) ) for all pairs i < j
```

- **S = 1.0**: All models select exactly the same features (perfect stability)
- **S = 0.0**: No feature overlap between any pair of models
- Computed using vectorized numpy operations: binary feature matrix, BLAS matrix multiply for intersections

**Implementation detail**: The binary feature matrix M (n_models x n_features) allows vectorized computation:

```python
intersections = M @ M.T           # dot product = |A ∩ B|
sums = M.sum(axis=1)              # |A|, |B|
unions = sums[:, None] + sums[None, :] - intersections   # |A ∪ B|
similarity = intersections / unions
distance = 1 - similarity
```

### Kuncheva Index

The Kuncheva index is a **chance-corrected** version of the intersection count, adjusting for the number of features selected (d) relative to the total feature space (c):

```
kappa(A, B) = ( |A intersection B| - d^2/c ) / ( d * (1 - d/c) )
```

where d = (|A| + |B|) / 2 (average model size).

- **kappa = 1.0**: Perfect agreement beyond chance
- **kappa = 0.0**: Agreement expected by random selection
- **kappa < 0**: Less agreement than random

The Kuncheva index is more informative than raw Tanimoto when model sizes are large relative to the total feature space, because random overlap becomes substantial. At k=50 with 500 features, random models share ~5 features by chance; the Kuncheva index accounts for this.

### CW_rel (Relative Weighted Consistency)

The **relative weighted consistency** index weights each feature's contribution by its frequency across models:

```
CW = sum_j ( f_j / N_total ) * ( (f_j - 1) / (n - 1) )
```

where:
- f_j = number of models selecting feature j
- N_total = total number of feature selections across all models
- n = number of models

This raw CW is then normalized to [0, 1] relative to the theoretical minimum:

```
CW_min = d / c       (expected under random selection)
CW_rel = (CW - CW_min) / (1 - CW_min)
```

CW_rel gives more weight to features that appear in many models and less weight to features appearing only once. It is less sensitive to outlier models than the pairwise Tanimoto.

## Stability vs. Sparsity Chart

The stability tab displays a **dual-axis chart**:

- **Left y-axis**: Stability indices (Tanimoto, Kuncheva, CW_rel) in [0, 1]
- **Right y-axis**: Mean AUC of models at that sparsity level
- **x-axis**: Sparsity level k (number of features)
- **Background**: Model count bars showing how many models exist at each k

This chart reveals the **optimal k** -- the sparsity level where stability is high and performance is adequate. Typical patterns:

| Pattern | Interpretation |
|---------|---------------|
| Stability increases with k | More features = more overlap. But large k means less interpretable models. |
| Stability peak at moderate k | Sweet spot: enough features to capture the signal, few enough to be consistent. |
| Stability drops at large k | Too many features -- models disagree on which extra features to include. |
| AUC plateau with rising stability | Ideal: adding more features doesn't improve AUC but does improve stability. Choose k where both plateau. |

## Feature x Sparsity Heatmap

A heatmap showing **feature prevalence at each sparsity level**:

- **Rows**: Top 50 most prevalent features (sorted by total prevalence across all k)
- **Columns**: Sparsity levels k
- **Color**: Prevalence (fraction of models at that k containing the feature), red heat scale

This reveals:
- **Core features**: High prevalence across all k (appear regardless of model size)
- **k-dependent features**: Only appear at specific sparsity levels (may be redundant with core features at lower k)
- **Signature building blocks**: The minimal set of features present at the lowest stable k

## Model Dendrogram (Hierarchical Clustering)

Models are clustered using **hierarchical agglomerative clustering** based on Tanimoto distance:

1. **Distance matrix**: Pairwise Tanimoto distance (1 - similarity) between all models (capped at 100 models for performance)
2. **Linkage**: Average linkage method -- merge clusters by minimizing the average inter-cluster distance
3. **Dendrogram**: U-shaped tree visualization showing merge heights
4. **Cluster assignment**: Cut the dendrogram at distance = 0.7 to identify distinct model families
5. **Leaf coloring**: Each leaf (model) colored by its cluster assignment

### Interpreting the Dendrogram

- **Short merge distances** (near the bottom): Models are very similar, likely differing by only 1-2 features
- **Tall merge distances** (near the top): Models are fundamentally different, representing distinct biomarker strategies
- **Balanced tree**: Many equally good strategies exist in the feature space
- **Unbalanced tree** (one large cluster, small outliers): A dominant signature with minor variations
- **Cutoff at 0.7**: Models within the same cluster share at least 30% of their features

### Performance Optimizations

For large populations (>100 models), the dendrogram computation is capped:
- Models are evenly sampled to 100 representatives
- Per-k groups larger than 80 are sampled for pairwise index computation
- Distance matrices use numpy BLAS-accelerated matrix multiply instead of Python loops

## References

- Kuncheva, L. I. (2007). A stability index for feature selection. *Proceedings of the 25th IASTED International Conference*, 390-395.
- Kalousis, A. et al. (2007). Stability of feature selection algorithms: a study on high-dimensional spaces. *Knowledge and Information Systems*, 12(1), 95-116.
- Cui, S. (2017). Mining sparse statistical learning models. Internship report, Ecole Polytechnique / ICAN.
