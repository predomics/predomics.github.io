---
layout: default
title: Usage
parent: Documentation
nav_order: 4
---

# Usage

## Web Application

### Basic Workflow

1. **Create a project** -- Click "New project" in the Projects page
2. **Upload datasets** -- In the Data tab, upload your training files (Xtrain.tsv, Ytrain.tsv) and optionally test files (Xtest.tsv, Ytest.tsv). You can also pick from the dataset library or load demo datasets.
3. **Explore data** -- Use the Data Explorer to inspect feature statistics, prevalence distributions, volcano plots, and barcode visualizations. Apply feature filtering (Wilcoxon, t-test, Bayesian Fisher).
4. **Configure parameters** -- In the Parameters tab, choose your algorithm (GA, Beam, MCMC), model language (binary, ternary, ratio), and adjust settings like population size, max epochs, k range, and cross-validation folds. Use templates for preset configurations.
5. **Launch analysis** -- Click "Launch Analysis". Monitor progress in real time via the console panel with live sparkline chart.
6. **Explore results** -- Once completed, browse:
   - **Summary**: best AUC, k, timing, generation tracking charts
   - **Population**: feature heatmap, violin plots, prevalence analysis
   - **Jury**: ensemble voting, confusion matrices, vote matrix, sample predictions
   - **Comparative**: compare multiple jobs side-by-side
   - **Co-presence**: feature co-occurrence analysis
   - **Ecosystem**: co-abundance network with taxonomic coloring and module detection
   - **Stability**: model stability indices (Kuncheva, Tanimoto, CW_rel), feature × sparsity heatmap, model clustering dendrogram

### Batch Mode

In the Parameters tab, enable "Batch Mode" to sweep across multiple configurations:

- Seeds (e.g., 42, 123, 456)
- Algorithms (GA, Beam, MCMC)
- Languages (bin, ter, ratio)
- Data types (raw, prev)
- Population sizes, max epochs, k_max values

The system generates all combinations and launches them as separate jobs (up to 50 per batch).

### External Validation

After training, validate your model on an independent cohort:

1. In the Results tab, select a completed job
2. Click "Validate on New Data"
3. Upload the validation X matrix (and optionally Y labels)
4. View AUC, accuracy, confusion matrix, and per-sample predictions

### Prediction API

Deploy trained models as REST endpoints:

```bash
curl -X POST http://localhost:8001/api/v1/projects/{id}/jobs/{job_id}/predict \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"features": {"species_A": 0.12, "species_B": 0.05}}'
```

### Exporting Results

From the Results tab, click "Export" to access:
- PDF biomarker report (publication-ready)
- HTML report (self-contained)
- CSV files (best model, population, generations, jury predictions)
- Python notebook (.ipynb)
- R notebook (.Rmd)
- Full JSON

## Python (gpredomicspy)

### Basic Analysis

```python
import gpredomicspy

# Load parameters from YAML
param = gpredomicspy.Param()
param.load("params.yaml")

# Run the evolutionary search
experiment = gpredomicspy.fit(param)

# Display results with jury voting
experiment.display_results()
```

### Accessing Results

```python
# Best individual from the population
best = experiment.best_population().best()
print(best.get_metrics())     # AUC, accuracy, sensitivity, specificity
print(best.get_features())    # Feature names and coefficients
print(best.get_k())           # Number of features

# Generation tracking
tracking = experiment.generation_tracking()

# Jury results
jury = experiment.jury_results()
```

### Parameter Configuration

```python
param = gpredomicspy.Param()
param.set_algorithm("ga")           # ga, beam, mcmc
param.set_language("ter")           # bin, ter, ratio
param.set_data_type("raw")          # raw, prev
param.set_max_epochs(200)
param.set_population_size(100)
param.set_k_range(3, 15)
param.set_n_folds_outer(5)
param.set_seed(42)
param.set_compute_importance(True)
param.set_voting(True)
```

## R Package

```r
library(predomics)

# Load data
data <- loadData("Xtrain.tsv", "Ytrain.tsv")

# Run analysis
result <- mainFunction(data,
  language = "ter",
  algorithm = "ga",
  populationSize = 100,
  maxEpochs = 200
)

# View results
print(result)
plotResults(result)
```
