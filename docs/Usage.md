---
layout: default
title: Usage
parent: Documentation
nav_order: 4
---

# Usage

## Web Application

1. Create a project and upload your datasets (Xtrain, Ytrain, optionally Xtest, Ytest)
2. Configure parameters (language, algorithm, population size, etc.)
3. Launch an analysis job and monitor progress in real time
4. Explore results: metrics, population, heatmaps, jury voting

## R Package

```r
library(predomics)
result <- mainFunction(data)
print(result)
```

## Python (gpredomicspy)

```python
import gpredomicspy

# Load parameters from YAML
param = gpredomicspy.Param()
param.load("params.yaml")

# Run the evolutionary search
experiment = gpredomicspy.fit(param)

# Display results with jury voting
experiment.display_results()

# Access the best individual
best = experiment.best_population().best()
print(best.get_metrics())
print(best.get_features())
```
