---
layout: default
title: "My Research"
permalink: /research/
body_class: research research-doc
---

<section class="page-card r-section">
  <span class="r-kicker">Research</span>
  <h1>A Patchwork of Worlds: AI for Population-Level Studies of Exoplanet Atmospheres</h1>
  <p class="r-lead">
    My research sits at the intersection of exoplanet atmospheres and artificial intelligence. I am interested
    in how emerging computational tools can move exoplanet science beyond individual case studies and toward
    a true population-level understanding of planetary atmospheres.
  </p>

  <figure class="r-fig r-fig-wide r-fig-hero">
    <img src="{{ '/Website_Pictures/Habitable_Worlds.jpg' | relative_url }}" alt="Illustration of habitable worlds compared with Earth">
  </figure>

  <p>
    The next decade of exoplanet science will be defined by scale. The James Webb Space Telescope is already
    transforming atmospheric characterization, and ESA's Ariel mission will push the field into a new regime:
    roughly a thousand planetary atmospheres observed with a common instrument and a common strategy, built
    to reveal population-level trends.
  </p>
  <p>
    That scale is an extraordinary opportunity, but it also creates a problem. We will have more data than we
    can reasonably interpret by hand. There are not enough graduate students in the world to manually inspect,
    retrieve, classify, and interpret every spectrum, target list, and population-level trend that the next
    generation of missions will produce.
  </p>
  <p>
    This is why I believe novel statistical methods, machine learning, and AI are becoming part of the scientific
    infrastructure of exoplanet atmospheres. The question is not simply whether we can get answers faster. The
    deeper question is whether we can build tools that allow us to ask better physical questions:
  </p>
  <ul class="r-questions">
    <li>How do planetary atmospheres remember formation?</li>
    <li>How does atmospheric metallicity scale with mass?</li>
    <li>How does stellar composition shape planetary composition?</li>
    <li>Which correlations are detectable, and which are artifacts?</li>
  </ul>
</section>

<section class="page-card r-section">
  <h2>HERMES &amp; the Ariel Space Mission</h2>

  <div class="paper-highlight">
    <span class="paper-kicker">New &middot; my first paper</span>
    <h3>HERMES: HiERarchical Modelling for Exoplanet Science</h3>
    <p class="paper-authors">Wasi M. F. Naqvi &amp; Nicolas B. Cowan &middot; arXiv:2606.02696</p>
    <p>
      A multidimensional Bayesian framework for population-level studies of exoplanet atmospheres &mdash; and
      the first piece of my thesis to make it out into the world.
    </p>
    <div class="paper-links">
      <a class="primary" href="https://arxiv.org/abs/2606.02696" target="_blank" rel="noopener noreferrer">Read on arXiv</a>
      <a href="https://arxiv.org/pdf/2606.02696" target="_blank" rel="noopener noreferrer">PDF</a>
    </div>
  </div>

  <p>
    My current work develops <strong>HERMES</strong> (HiERarchical Modelling for Exoplanet Science), a
    multidimensional Bayesian framework for population-level studies of exoplanet atmospheres.
    HERMES asks how survey design, sample size, measurement noise, and intrinsic astrophysical scatter affect our
    ability to recover physical trends across planetary mass, atmospheric metallicity, and stellar composition.
  </p>
  <p>
    Ariel is the natural testbed for this work. By observing a large, diverse sample of exoplanet atmospheres with
    a common mission strategy, Ariel will make it possible to compare planets as a population rather than as isolated
    case studies. HERMES is built to help turn that survey scale into interpretable science yield forecasts and,
    eventually, into physical constraints on how planetary atmospheres form and evolve.
  </p>

  <div class="r-fig-grid">
    <figure class="r-fig">
      <img src="{{ '/hermes_2d_to_3d.gif' | relative_url }}" alt="HERMES: 2D to 3D hierarchical model visualisation">
      <figcaption>HERMES: population inference from 2D to 3D parameter space.</figcaption>
    </figure>
    <figure class="r-fig">
      <img src="{{ '/Website_Pictures/ariel.jpeg' | relative_url }}" alt="ESA Ariel Mission">
      <figcaption>ESA's Ariel space mission.</figcaption>
    </figure>
    <figure class="r-fig">
      <img src="{{ '/Website_Pictures/WASP-39_b.jpg' | relative_url }}" alt="JWST atmosphere composition spectrum for WASP-39 b">
      <figcaption>JWST's spectrum of WASP-39 b shows the richness of modern atmospheric characterization.</figcaption>
    </figure>
    <figure class="r-fig">
      <img src="{{ '/Website_Pictures/Picturing_Exoplanet_Clouds.jpeg' | relative_url }}" alt="Illustration of different exoplanet cloud types">
      <figcaption>Clouds, chemistry, and temperature structure vary across worlds, making population-level tools essential.</figcaption>
    </figure>
  </div>
</section>

<section class="page-card r-section">
  <h2>ASTER &amp; Patchwork</h2>
  <p>
    HERMES asks what a population of atmospheres can tell us once the measurements exist. The other half of the
    problem is producing those measurements at survey scale, and that is where my current work sits.
    <strong>Patchwork</strong> is a pipeline that takes a JWST transit observation from raw detector frames
    through to a transmission spectrum. <strong>ASTER</strong> is the agent that drives it.
  </p>
  <p>
    A single JWST reduction is a long chain of decisions &mdash; calibration, extraction, systematics, limb
    darkening, noise modelling &mdash; and each one is defensible in isolation and consequential in aggregate.
    Doing that once, carefully, is a paper. Doing it consistently across a survey is a different kind of problem,
    and it is the one I am interested in.
  </p>

  <figure class="r-fig r-fig-wide">
    <a href="{{ '/assets/aster_pipeline.png' | relative_url }}" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/aster_pipeline.png' | relative_url }}" alt="ASTER pipeline: from raw JWST frames to an atmospheric posterior">
    </a>
    <figcaption>Raw frames in, atmosphere out. Click to enlarge.</figcaption>
  </figure>

  <p>
    So far the pipeline has been pointed at targets with published spectra, on the principle that a new tool
    should first reproduce results someone else already got the hard way. It does. Some of the targets it has
    since worked through do not have published values yet.
  </p>

  <figure class="r-fig">
    <img src="{{ '/assets/patchwork_whitelight.png' | relative_url }}" alt="A JWST NIRSpec/G395H white-light transit fit from the Patchwork pipeline">
    <figcaption>A white-light transit fit, one of many steps between raw frames and a spectrum.</figcaption>
  </figure>

  <p>
    The design question I find most interesting is not whether an agent can run a pipeline. It can. It is what has
    to be true before you believe the number that comes out the other end. Most of the work has gone into the parts
    that refuse: checks that live in the code rather than in a prompt, that stop a bad reduction early and report
    uncertainty honestly rather than confidently. Scale is only worth having if the results survive the scrutiny a
    careful hand reduction would get.
  </p>
  <p class="r-coda">More on this in time, once it is written up.</p>
</section>
