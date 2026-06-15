# MAIA Documentation

## Overview

**MAIA** is the ASTER-derived framework paper and software layer.
It is not HERMES.

MAIA is the cloud-aware, multi-agent atmospheric analysis framework that extends the ASTER philosophy toward:

- archival JWST and HST atmospheric spectra
- physically motivated cloud-aware forward models
- Virga + TauREx integration
- Ariel-style simulated spectroscopy
- reproducible retrieval and analysis workflows

**HERMES** remains the hierarchical population-inference framework.
The clean division is:

- **MAIA** builds, retrieves, curates, and simulates atmospheres
- **HERMES** interprets populations and decomposes scatter

Short version:

**MAIA builds the atmospheric evidence; HERMES explains the population.**

## Why MAIA Exists

In earlier work, simplified cloud prescriptions such as gray opaque decks parameterized only by cloud-top pressure were sufficient for first-order feasibility studies. That is useful, but it is not enough for the science questions now in front of us.

Clouds and hazes are not just nuisance parameters. They shape the wavelength dependence of observed transmission spectra, suppress molecular features, and can bias inferred atmospheric properties. A framework that treats clouds only as gray opacity cannot capture the microphysical diversity likely present across real exoplanet atmospheres.

MAIA is designed to replace this simplified treatment with a physically motivated, cloud-aware framework built around Virga and TauREx, while also retaining the modular, agentic workflow ideas that make ASTER useful.

## Core Scientific Role

MAIA should be framed as a **methods paper with a science demonstration**, not as the full HERMES population paper.

The central question for the MAIA paper is:

**How does replacing gray-cloud parameterizations with physically motivated cloud microphysics change atmospheric inference from archival and simulated exoplanet spectra?**

A sharper version is:

**Can a multi-agent, cloud-aware framework using Virga and TauREx recover atmospheric properties more faithfully than gray-cloud pipelines when applied to JWST/HST archival spectra and Ariel-style simulations?**

This keeps the MAIA paper focused, publishable, and distinct from HERMES.

## Relation to ASTER

ASTER provides the architectural starting point: a modular, agentic pipeline for querying archives, downloading spectra, running TauREx, and producing atmospheric analyses.

MAIA extends that architecture for the specific needs of cloud-aware exoplanet atmosphere work.

The key distinction is that MAIA is not just an ASTER rebrand. It adds missing physical and workflow capabilities needed for:

- wavelength-dependent cloud microphysics
- archival JWST and HST validation
- Ariel simulation support
- sub-Neptune-focused atmospheric use cases

## Relation to HERMES

HERMES and MAIA should remain separate both conceptually and in writing.

HERMES version 1.0 showed that increasing intrinsic scatter degrades Ariel's ability to recover the multidimensional mass-metallicity relation. But in HERMES, the scatter term was abstract and physically unassigned.

MAIA does not replace HERMES. Instead, MAIA provides the physical atmospheric machinery that later allows HERMES to ask whether some of that apparent scatter is actually caused by clouds and hazes.

That means:

- **MAIA paper**: framework, cloud-aware modeling, archival validation, simulation demonstration
- **future HERMES cloud paper**: population inference using MAIA-generated or MAIA-processed spectra

## Scientific Motivation

The relevant scientific problem is not merely whether clouds exist. That is already obvious.

The actual problem is that clouds and hazes can mimic or distort trends that would otherwise be interpreted as metallicity structure, chemical diversity, or atmospheric evolution. This matters directly for Ariel-style survey science and also for interpretation of archival JWST and HST spectra.

Gray cloud models capture suppression in only the crudest way. Virga makes it possible to model cloud structure more physically through parameters such as:

- equilibrium temperature
- gravity
- metallicity
- sedimentation efficiency `f_sed`

Virga returns wavelength-dependent cloud opacities. TauREx then propagates those opacities through radiative transfer to produce transmission spectra. That is the key physical improvement.

## MAIA Architecture

At a high level, the framework is:

`archive or simulated target -> parameter ingestion -> Virga cloud calculation -> TauREx forward model or retrieval -> analysis products`

A more complete version is:

`JWST/HST archive or Ariel target catalog -> target metadata -> Virga cloud microphysics -> TauREx spectrum generation/retrieval -> noise model or instrument mapping -> plots, posterior summaries, proxy measurements, export products`

## Proposed Functional Modules

MAIA should include the following major components.

### 1. Archive Access

This module retrieves reduced, published spectra and metadata from:

- JWST archival products
- HST archival products
- NASA Exoplanet Archive atmospheric products
- target metadata services as needed

This is the empirical input layer for validation work.

### 2. Cloud Microphysics Layer

This is the central physical addition.

Virga should be used to compute cloud properties from atmospheric and planetary parameters such as:

- `T_eq`
- gravity
- metallicity
- `f_sed`
- condensate choices

The output is wavelength-dependent cloud opacity information suitable for downstream spectral modeling.

### 3. TauREx Integration

TauREx is the radiative transfer and retrieval engine.

In MAIA, TauREx should no longer be limited to gray-cloud assumptions when cloud-aware mode is active. Instead, it should accept Virga-derived cloud opacity structures as part of the atmospheric model.

### 4. Retrieval Layer

MAIA should support single-target atmospheric inference for archival spectra and for simulated observations. This is where cloud-aware retrievals can be compared directly against simpler gray-cloud treatments.

### 5. Ariel Simulation Support

MAIA should support Ariel-style simulated spectra, including target metadata handling and instrument/noise interfaces where relevant. This is what makes the framework useful for forecast studies rather than archival-only analysis.

### 6. Analysis Products

The framework should output science-ready products such as:

- forward-model spectra
- retrieval posteriors
- cloud proxy diagnostics
- model comparison outputs
- figure-ready summary tables

## Recommended Paper Scope

The MAIA paper should do three things well:

1. Introduce the framework and explain what is new relative to ASTER.
2. Demonstrate that physically motivated clouds materially affect inference.
3. Show that the framework is useful on both archival and Ariel-style data.

That means the paper should not attempt to absorb the full HERMES population-level cloud-scatter science case. That would overload the methods paper and blur the conceptual boundaries.

## Recommended Science Demonstration

The demonstration should be strong enough to justify the framework scientifically.

A good structure is:

1. Select a small archival sample with meaningful cloud or haze relevance.
2. Run gray-cloud and Virga-aware analyses side by side.
3. Quantify how the inferred atmospheric properties change.
4. Repeat the comparison for Ariel-style simulated observations of representative targets.

This would let MAIA make a clear claim:

**physically motivated cloud treatment changes atmospheric inference in a measurable, mission-relevant way.**

## Suggested Archival Use Case

Archival validation should focus on a small, defensible sample rather than an overextended survey at first.

The immediate purpose of archival data in the MAIA paper is not to solve the exoplanet mass-metallicity relation. It is to show that the framework behaves sensibly on real spectra and that cloud-aware inference is not just a simulation artifact.

That makes archival JWST and HST data an empirical validation layer, not the full endgame.

## Distinction From the Future HERMES Cloud Paper

This distinction should be stated clearly in your notes and eventually in talks:

- **MAIA** asks how cloud-aware physics changes inference on spectra
- **HERMES cloud paper** asks how cloud-induced apparent scatter affects population trends

The first is a framework-and-demonstration paper.
The second is a population-inference science paper.

They are connected, but not identical.

## Key Novelty

The novelty of MAIA is not simply that it uses AI or agents.

The real novelty is the combination of:

- ASTER-derived multi-agent workflow design
- physically motivated cloud microphysics through Virga
- TauREx-based spectral modeling and retrieval
- applicability to both archival and mission-forecast data

That combination is what makes the framework scientifically useful rather than just technically interesting.

## Draft One-Paragraph Paper Pitch

MAIA is a cloud-aware, ASTER-derived framework for exoplanet atmospheric analysis that integrates archival spectrum access, Virga cloud microphysics, and TauREx forward modeling and retrieval into a modular multi-agent workflow. Its core purpose is to move beyond gray-cloud parameterizations by enabling physically motivated, wavelength-dependent cloud treatments for both archival JWST/HST spectra and Ariel-style simulations. The MAIA paper should demonstrate that this change in atmospheric physics materially alters inferred atmospheric properties and therefore matters for future survey interpretation.

## Short Tagline Options

- **MAIA: cloud-aware atmospheric inference for exoplanet spectra**
- **MAIA: an ASTER-derived framework for microphysics-aware exoplanet atmosphere analysis**
- **MAIA: from archival spectra to cloud-aware Ariel simulations**

## Working Boundaries

To keep the project coherent:

- do not define MAIA as HERMES
- do not let the MAIA paper become the full population-scatter paper
- do use MAIA as the forward-model and archival-analysis foundation for later HERMES science

## Recommended Next Steps

1. Freeze the one-sentence definition of MAIA.
2. Decide the first archival demonstration sample.
3. Define the minimum viable Virga-to-TauREx integration.
4. Decide whether Ariel simulation support is in version 1 of the paper or a later section.
5. Keep HERMES as a separate follow-on science engine.

## Recommended One-Sentence Definition

**MAIA is an ASTER-derived, cloud-aware multi-agent framework for exoplanet atmospheric analysis that integrates archival spectra, Virga microphysics, and TauREx modeling for both real and simulated observations.**
