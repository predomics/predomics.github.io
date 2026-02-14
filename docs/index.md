---
layout: default
title: Documentation
nav_order: 1
---

# Documentation

Welcome to the Predomics documentation. Navigate through the sidebar to learn about the project.

## Overview

Predomics discovers **parsimonious predictive models** from omics data. Given a high-dimensional feature matrix (e.g. metagenomic species abundances) and binary class labels (e.g. healthy vs. disease), the algorithms search for the smallest set of features that accurately discriminate between classes.

The models use simple mathematical languages:
- **Binary** (0/1) -- feature presence/absence
- **Ternary** (-1/0/+1) -- feature contributes negatively, is absent, or contributes positively
- **Ratio** -- ratio of two feature groups

These compact signatures are easy to interpret, validate, and translate into clinical biomarkers.

## Architecture

```
predomicspkg (R)          -- Original algorithms and visualizations
gpredomics (Rust)         -- High-performance engine
  gpredomicspy (Python)   -- Python bindings via PyO3/Maturin
predomicsapp-web          -- Web application
  backend (FastAPI)       -- REST API, job runner, PostgreSQL
  frontend (Vue.js 3)     -- Interactive UI with Plotly charts
```
