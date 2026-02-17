---
layout: default
title: Ecosystem Network
parent: Methods
nav_order: 5
---

# Co-Abundance Ecosystem Network

The ecosystem network visualizes microbial species as a co-abundance network, revealing ecological relationships (cooperation, competition, niche sharing) and their connection to disease-associated biomarkers.

Inspired by the Interpred approach (Magali Cousin-Thorez internship, 2019) and the SCAPIS ecosystem work (Edi Prifti, 2024).

## Network Construction

### Step 1: Feature Filtering by Prevalence

Before computing correlations, features are filtered by **prevalence** -- the fraction of samples where the feature is detected (value > 0):

```
prevalence(feature_j) = count(samples where F_j > 0) / N_samples * 100
```

Only features with prevalence >= `min_prevalence_pct` (default 30%) are retained. This removes rare species whose correlations would be unreliable due to excess zeros.

**Rationale**: In metagenomic data, many species are present in only a few samples. Correlations between two rarely-detected species are dominated by the (0, 0) pairs and do not reflect true ecological interactions.

### Step 2: Spearman Rank Correlation

Pairwise **Spearman rank correlations** are computed between all retained features:

```
rho(F_i, F_j) = Pearson correlation of rank(F_i), rank(F_j)
```

Spearman is preferred over Pearson because:
- **Robust to outliers**: Rank-based, not affected by extreme values
- **Captures monotonic relationships**: Not limited to linear associations
- **Handles zeros**: Common in sparse metagenomic data

For feature sets <= 1000, the full correlation matrix is computed at once using `scipy.stats.spearmanr`. For larger sets, pairwise computation is used.

### Step 3: Edge Filtering

Only edges where |rho| >= `correlation_threshold` (default 0.3) are retained. This produces a sparse network focused on the strongest associations.

- **Positive correlations** (rho > 0): Species that increase together (co-abundance, potential cooperation or shared niche)
- **Negative correlations** (rho < 0): Species that show inverse abundance patterns (competition, different niches, or mutual exclusion)

### Step 4: Class-Specific Networks

Networks can be computed for:
- **All samples**: The overall ecological structure
- **Class 0 only** (e.g., healthy controls): The healthy ecosystem
- **Class 1 only** (e.g., patients): The disease-associated ecosystem

Comparing class-specific networks reveals how disease reorganizes the microbial ecosystem -- which interactions are preserved, which are disrupted, and which emerge.

## Community Detection (Louvain)

The network is partitioned into **modules** (communities) using the **Louvain algorithm**:

1. Start with each node in its own community
2. For each node, evaluate the **modularity gain** of moving it to each neighbor's community
3. Move the node to the community that maximizes modularity gain
4. Repeat until no improvement is possible
5. Build a new network where nodes are the communities, and repeat

The **modularity score** Q measures the quality of the partition:

```
Q = (1/2m) * sum_ij [ A_ij - (k_i * k_j) / (2m) ] * delta(c_i, c_j)
```

where:
- A_ij = adjacency matrix (weighted by |rho|)
- k_i = degree of node i
- m = total edge weight
- delta(c_i, c_j) = 1 if nodes i and j are in the same community

- **Q > 0.3**: Significant community structure (typical for ecological networks)
- **Q > 0.5**: Strong modular organization
- **Q close to 0**: No clear community structure

### Ecological Interpretation

Modules represent **ecological niches** -- groups of species that tend to co-occur and may share functional roles:

- Module with many Bacteroidota: Polysaccharide degradation niche
- Module with many Bacillota: Short-chain fatty acid production niche
- Module mixing phyla: Cross-phylum metabolic interactions
- Module disrupted in disease: Potential therapeutic target

## Node Metrics

### Degree

The number of edges connected to a node. High-degree species are **hubs** -- central to the network and potentially keystone species.

### Betweenness Centrality

The fraction of shortest paths between all pairs of nodes that pass through a given node:

```
BC(v) = sum_{s != v != t} ( sigma_st(v) / sigma_st )
```

where sigma_st is the total number of shortest paths from s to t, and sigma_st(v) is the number passing through v.

High-betweenness species are **bridges** between modules -- removing them would fragment the network.

### Per-Class Prevalence

For each species, prevalence is computed separately in class 0 and class 1 samples. The **enriched class** is the one with higher prevalence:

```
enriched_class = 1 if prevalence_1 > prevalence_0 else 0
```

### Mean Abundance

Average abundance across all samples (or class-specific samples). Reflects the overall contribution of the species to the community.

## Taxonomic Coloring

### SCAPIS Phylum Palette

A consistent color scheme assigns base colors to major bacterial phyla:

| Phylum | Color | Hex |
|--------|-------|-----|
| Bacillota (Firmicutes) | Blue | #08519c |
| Bacteroidota | Red | #d73027 |
| Pseudomonadota (Proteobacteria) | Green | #1a9850 |
| Actinomycetota | Purple | #ae017e |
| Verrucomicrobiota | Orange | #f16913 |
| Fusobacteriota | Brown | #8c6d31 |

### Family-Level Shading

Within each phylum, families are distinguished by **lightening or darkening** the phylum base color:

```
family_color = lighten(phylum_color, amount)   // for family 1
family_color = darken(phylum_color, amount)     // for family 2
```

The amount is spaced evenly across families within the phylum, producing a gradient from light to dark. This ensures:
- Each family has a visually distinct color
- Families within the same phylum are perceptually grouped
- The color scheme is consistent across analyses

### Color Modes

The network supports three coloring modes:

1. **Taxonomy**: Nodes colored by family (within phylum gradient)
2. **Module**: Nodes colored by Louvain community (12-color palette)
3. **Enrichment**: Nodes colored by which class they are enriched in

## FBM Overlay

When a completed job is selected, the network can be annotated with data from the Family of Best Models:

### FBM Prevalence

For each feature in the network, compute the fraction of FBM models that include it:

```
fbm_prevalence(feature) = count(FBM models containing feature) / |FBM|
```

Node size or opacity can be scaled by FBM prevalence, highlighting features that are consistently selected as biomarkers.

### Dominant Coefficient

The dominant coefficient direction across FBM models:

```
coefficient = sign( sum(coefficients across FBM models) )
```

- **+1**: Feature typically contributes positively (enriched in disease)
- **-1**: Feature typically contributes negatively (enriched in controls)

Node shape encodes this: squares for +1 (disease-associated), circles for -1 (health-associated).

### Bridging Ecological and Predictive Views

The FBM overlay connects two perspectives:
- **Ecological**: Which species co-occur, which compete, what modules exist
- **Predictive**: Which species are selected by the algorithms, with what coefficients

This reveals whether biomarkers cluster in specific ecological modules (suggesting niche-level disruption) or are scattered across the network (suggesting diffuse changes).

## Layout Algorithms

Four layout algorithms are available for positioning nodes:

| Layout | Algorithm | Best for |
|--------|-----------|----------|
| **Organic** | Fruchterman-Reingold with simulated annealing | General purpose, reveals clusters naturally |
| **Force-directed** | Spring-electrical model | Large networks, even spacing |
| **Circle** | Nodes arranged on a circle by module | Module comparison, clean visualization |
| **Radial** | Hub nodes at center, others radiate outward | Highlighting central species |

## Interactive Controls

- **Prevalence threshold** (10-80%): Filter rare species
- **Correlation threshold** (0.1-0.8): Filter weak associations
- **Class filter**: All / Class 0 / Class 1
- **Color mode**: Taxonomy / Module / Enrichment
- **Layout**: Organic / Force-directed / Circle / Radial
- **FBM overlay** toggle: Annotate with model data
- **Module click**: Highlight all nodes in a module

## References

- Blondel, V. D. et al. (2008). Fast unfolding of communities in large networks. *J. Stat. Mech.*, P10008.
- Fruchterman, T. M. J. & Reingold, E. M. (1991). Graph drawing by force-directed placement. *Software: Practice and Experience*, 21(11), 1129-1164.
- Cousin-Thorez, M. (2019). Interpred: Interpretation of predictive models. Internship report, ICAN.
- Prifti, E. (2024). SCAPIS ecosystem analysis. Internal report.
