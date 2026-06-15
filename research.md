---
layout: default
title: "My Research"
permalink: /research/
body_class: research
---

<section class="page-card">
  <h1>A Patchwork of Worlds: AI for Population-Level Studies of Exoplanet Atmospheres</h1>
  <p>
    My research sits at the intersection of exoplanet atmospheres and artificial intelligence. I am interested
    in how emerging computational tools can move exoplanet science beyond individual case studies and toward
    a true population-level understanding of planetary atmospheres.
  </p>

  <div class="research-hero-image">
    <img src="{{ '/Website_Pictures/Habitable_Worlds.jpg' | relative_url }}" alt="Illustration of habitable worlds compared with Earth">
  </div>

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
    deeper question is whether we can build tools that allow us to ask better physical questions: How do planetary
    atmospheres remember formation? How does atmospheric metallicity scale with mass? How does stellar composition
    shape planetary composition? Which correlations are detectable, and which are artifacts?
  </p>

  <h2>HERMES &amp; the Ariel Space Mission</h2>
  <p>
    My current work develops <a href="https://arxiv.org/abs/2606.02696" target="_blank" rel="noopener noreferrer"><strong>HERMES</strong></a>
    (HiERarchical Modelling for Exoplanet Science), a multidimensional Bayesian framework for population-level
    studies of exoplanet atmospheres. HERMES asks how survey design, sample size, measurement noise, and intrinsic
    astrophysical scatter affect our ability to recover physical trends across planetary mass, atmospheric
    metallicity, and stellar composition.
  </p>
  <p>
    Ariel is the natural testbed for this work. By observing a large, diverse sample of exoplanet atmospheres with
    a common mission strategy, Ariel will make it possible to compare planets as a population rather than as isolated
    case studies. HERMES is built to help turn that survey scale into interpretable science yield forecasts and,
    eventually, into physical constraints on how planetary atmospheres form and evolve.
  </p>

  <div class="blog-img-single">
    <img src="{{ '/hermes_2d_to_3d.gif' | relative_url }}" alt="HERMES: 2D to 3D hierarchical model visualisation">
    <p class="blog-caption">HERMES: population inference from 2D to 3D parameter space.</p>
  </div>

  <div class="blog-img-single">
    <img src="{{ '/Website_Pictures/ariel.jpeg' | relative_url }}" alt="ESA Ariel Mission">
    <p class="blog-caption">ESA Ariel Space Mission.</p>
  </div>

  <div class="research-image-grid">
    <figure>
      <img src="{{ '/Website_Pictures/WASP-39_b.jpg' | relative_url }}" alt="JWST atmosphere composition spectrum for WASP-39 b">
      <figcaption>JWST's spectrum of WASP-39 b shows the richness of modern atmospheric characterization.</figcaption>
    </figure>
    <figure>
      <img src="{{ '/Website_Pictures/Picturing_Exoplanet_Clouds.jpeg' | relative_url }}" alt="Illustration of different exoplanet cloud types">
      <figcaption>Clouds, chemistry, and temperature structure vary across worlds, making population-level tools essential.</figcaption>
    </figure>
  </div>
</section>
