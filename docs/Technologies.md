---
layout: default
title: Technologies
parent: Documentation
nav_order: 6
---

# Technologies

## Rust Engine (gpredomics)

The core ML engine is implemented in Rust for maximum performance:

- **Rust** -- All evolutionary algorithms (GA, Beam, MCMC), fitness evaluation, cross-validation, and jury voting
- **CUDA** -- Optional GPU acceleration for fitness evaluation on large datasets
- **PyO3 / Maturin** -- Python bindings exposing the full API as a native Python module (`gpredomicspy`)
- **Serde / YAML** -- Parameter serialization and configuration loading
- **Rayon** -- Parallel computation for population evaluation

Performance: up to 1,000x speedup over the original R implementation, processing thousands of features across hundreds of samples in seconds.

## Web Application (predomicsapp-web)

### Backend (Python)
- **FastAPI** -- Async REST API with automatic OpenAPI documentation (50+ endpoints)
- **SQLAlchemy 2.0** -- Async ORM with PostgreSQL for user, project, dataset, and job management
- **Pydantic v2** -- Request/response validation and serialization
- **WebSocket** -- Real-time job monitoring with structured progress streaming
- **reportlab** -- PDF biomarker report generation
- **nbformat** -- Jupyter notebook (.ipynb) generation
- **JWT + API Keys** -- Authentication with role-based access control
- **Background Tasks** -- Non-blocking job execution with subprocess management

### Frontend (JavaScript)
- **Vue.js 3** -- Reactive UI with Composition API and `<script setup>` syntax
- **Pinia** -- State management for auth, projects, and application state
- **Vue Router** -- Client-side routing with authentication guards
- **vue-i18n** -- Full internationalization (English and French)
- **Plotly.js** -- All interactive charts (AUC evolution, heatmaps, violin plots, SHAP, waterfall, etc.)
- **Vite** -- Fast development server and optimized production builds
- **IntersectionObserver** -- Scroll-reveal animations on the landing page

### Infrastructure
- **Docker Compose** -- Single-command deployment with multi-stage builds
- **PostgreSQL 16** -- Production database with migration support
- **NGINX** -- Reverse proxy for static assets and API routing
- **pytest + Vitest** -- Backend and frontend test suites

## R Package (predomicspkg)

The original implementation and reference for the algorithms:

- **R** -- Core algorithm implementations (TerGa1, TerGa2, TerBeam, TerDa)
- **doSNOW / foreach** -- Parallel computation across multiple cores
- **pROC** -- ROC curve analysis and AUC computation
- **glmnet** -- Regularized regression for comparison baselines
- **viridis** -- Publication-quality color palettes for visualizations
- **Shiny** -- Original interactive web interface (legacy, superseded by PredomicsApp)

## GitHub Pages (predomics.github.io)

- **Jekyll** -- Static site generator with the just-the-docs theme
- **Markdown** -- Documentation content
- **Vanilla JS** -- Scroll animations, screenshot gallery, counter effects
