---
layout: default
title: "My Research"
permalink: /research/
body_class: research research-doc
---

<section class="page-card r-section r-hero">
  <div class="r-split">
    <div>
      <span class="r-kicker">Research</span>
      <h1>A Patchwork of Worlds</h1>
      <p class="r-subtitle">AI for population-level studies of exoplanet atmospheres</p>
      <p class="r-lead">
        The most common planets in the Galaxy remain the least understood. I study
        <strong>sub-Neptunes</strong> &mdash; larger than Earth, smaller than Neptune, absent from our own
        Solar System, and more numerous than every other kind of planet &mdash; not one at a time, but as a
        population.
      </p>
      <div class="r-stats">
        <div class="r-stat"><span class="r-stat-num">30,000 h</span><span class="r-stat-label">of JWST time for exoplanets across the mission</span></div>
        <div class="r-stat"><span class="r-stat-num">~1,000</span><span class="r-stat-label">exoplanet atmospheres for ESA's Ariel, which Canada has joined</span></div>
        <div class="r-stat"><span class="r-stat-num">1</span><span class="r-stat-label">consistent analysis for all of them</span></div>
      </div>
    </div>
    <figure class="r-fig r-fig-hero">
      <img src="{{ '/Website_Pictures/Habitable_Worlds.jpg' | relative_url }}" alt="Illustration of habitable worlds compared with Earth">
    </figure>
  </div>
</section>

<section class="page-card r-section">
  <div class="r-split">
    <div>
      <h2>The question</h2>
      <p>
        We still cannot say what a typical sub-Neptune actually <em>is</em>. The same mass and radius fit
        very different worlds, and constraining the abundances of molecules such as water, methane and carbon
        dioxide is a prerequisite for any statement about what lies beneath an atmosphere &mdash; or about
        habitability.
      </p>
      <p>
        For the first time, the data to settle this are arriving at scale. We can finally study exoplanets as
        populations rather than as isolated worlds. The challenge is to combine those observations
        consistently, to tell genuine planetary diversity apart from observational and analysis effects, and to
        find the trends that survive: turning a growing archive of individual spectra into a
        <strong>comparative climatology</strong> of planetary atmospheres.
      </p>
    </div>
    <div class="r-cards">
      <div class="r-card">
        <span class="r-card-tag">Possibility 1</span>
        <h3>Rocky core, thin envelope</h3>
        <p>A rocky interior beneath a thin hydrogen-rich atmosphere.</p>
      </div>
      <div class="r-card">
        <span class="r-card-tag">Possibility 2</span>
        <h3>Water world</h3>
        <p>A deep water layer beneath a heavy, steam-rich atmosphere.</p>
      </div>
      <div class="r-card">
        <span class="r-card-tag">Possibility 3</span>
        <h3>Magma world</h3>
        <p>A largely airless body of molten rock.</p>
      </div>
    </div>
  </div>
</section>

<section class="page-card r-section">
  <h2>A Patchwork of Worlds: A Uniform JWST Survey of Sub-Neptune Atmospheres</h2>
  <p class="r-callout">
    I am building the first population-level survey of sub-Neptunes observed with JWST, with every planet
    analysed by the same end-to-end framework.
  </p>
  <div class="r-split">
    <div>
      <p>
        The idea is to <em>stitch together</em> observations of individual worlds into a coherent view of the
        sub-Neptune population &mdash; hence the name. Public JWST observations from many teams and programmes
        are reprocessed through one pipeline, so that planets can be compared directly instead of through a
        stack of separately analysed spectra.
      </p>
      <p>
        Two problems make this hard. Very different atmospheres can produce similar spectra: a thin
        hydrogen-rich atmosphere can be difficult to tell apart from a much heavier steam-rich one. And
        differences between observations or analysis choices can masquerade as differences between planets.
        So the first job is to work out which differences in the spectra are actually caused by the planets.
      </p>
      <p>
        For each planet I measure molecular abundances, atmospheric metallicity and mean molecular weight,
        while accounting for clouds, hazes, and contamination from the host star.
      </p>
    </div>
    <figure class="r-fig">
      <img src="{{ '/assets/patchwork_whitelight.png' | relative_url }}" alt="A JWST NIRSpec/G395H white-light transit fit from the Patchwork pipeline">
      <figcaption>A white-light transit fit, one of many steps between raw detector frames and a spectrum.</figcaption>
    </figure>
  </div>

  <div class="r-cards r-cards-row">
    <div class="r-card">
      <span class="r-card-tag">Test case</span>
      <h3>GJ 3090 b, observed twice</h3>
      <p>
        One planet's spectrum should be reproducible, yet two JWST visits do not share the same spectral shape.
        Is it the observations, the analysis, the star, or the atmosphere itself changing?
      </p>
    </div>
    <div class="r-card">
      <span class="r-card-tag">Test case</span>
      <h3>TOI-836 b &amp; c, one star</h3>
      <p>
        Two planets on opposite sides of the radius valley, the divide between mostly rocky planets and those
        that keep substantial atmospheres. Same star, same birth environment: why does one keep its air?
      </p>
    </div>
    <div class="r-card">
      <span class="r-card-tag">Then</span>
      <h3>The population</h3>
      <p>
        How atmospheric properties vary with irradiation, gravity, planetary mass and host-star composition
        &mdash; which processes decide whether a sub-Neptune acquires, transforms, or retains its atmosphere.
      </p>
    </div>
  </div>
</section>

<section class="page-card r-section">
  <h2>HERMES &amp; the Ariel mission</h2>
  <div class="r-split r-split-even">
    <div>
      <div class="paper-highlight">
        <span class="paper-kicker">New &middot; my first paper</span>
        <h3>HERMES: HiERarchical Modelling for Exoplanet Science</h3>
        <p class="paper-authors">Wasi M. F. Naqvi &amp; Nicolas B. Cowan &middot; arXiv:2606.02696</p>
        <div class="paper-links">
          <a class="primary" href="https://arxiv.org/abs/2606.02696" target="_blank" rel="noopener noreferrer">Read on arXiv</a>
          <a href="https://arxiv.org/pdf/2606.02696" target="_blank" rel="noopener noreferrer">PDF</a>
        </div>
      </div>
    </div>
    <div>
      <p>
        The population analysis builds on <strong>HERMES</strong>, a multidimensional Bayesian framework that
        identifies population-level relationships while separating true astrophysical diversity from
        measurement uncertainty.
      </p>
      <p>
        HERMES also answers a survey-design question: how many planets, measured how precisely, before an
        apparent trend can be trusted? That turns target selection into a quantitative problem &mdash; exactly
        the one Ariel faces as it fixes its target list, and one Canadian astronomers are now at the centre of.
      </p>
    </div>
  </div>
  <div class="r-fig-grid r-fig-grid-large">
    <figure class="r-fig">
      <a href="{{ '/hermes_2d_to_3d.gif' | relative_url }}" target="_blank" rel="noopener noreferrer">
        <img src="{{ '/hermes_2d_to_3d.gif' | relative_url }}" alt="HERMES: 2D to 3D hierarchical model visualisation">
      </a>
      <figcaption>HERMES: population inference from 2D to 3D parameter space.</figcaption>
    </figure>
    <figure class="r-fig">
      <a href="{{ '/Website_Pictures/ariel.jpeg' | relative_url }}" target="_blank" rel="noopener noreferrer">
        <img src="{{ '/Website_Pictures/ariel.jpeg' | relative_url }}" alt="ESA Ariel Mission">
      </a>
      <figcaption>ESA's Ariel space mission.</figcaption>
    </figure>
  </div>
</section>

<section class="page-card r-section">
  <h2>ASTER: the agent that runs it</h2>
  <div class="r-split r-split-even">
    <div>
      <p>
        <strong>ASTER</strong> (Agentic Science Toolkit for Exoplanet Research) is an agentic AI framework for
        exoplanet analysis, originally built by <strong>Emilie Panek</strong> and collaborators. I am
        collaborating with Emilie and developing tools for it, including Patchwork's JWST data reduction.
      </p>
      <div class="arxiv-line">
        <span class="arxiv-label">Original work</span>
        <a class="arxiv-btn" href="https://arxiv.org/abs/2603.26953" target="_blank" rel="noopener noreferrer">arXiv:2603.26953</a>
        <span class="arxiv-cite">Panek et al. 2026, <em>ASTER &mdash; Agentic Science Toolkit for Exoplanet Research</em></span>
      </div>
    </div>
    <div>
      <p>
        An agent can run a pipeline. The hard part is knowing when to believe what comes out. Most of my work
        is checks that live in the code rather than in a prompt, that stop a bad reduction early and report
        uncertainty honestly.
      </p>
    </div>
  </div>
  <figure class="r-fig r-fig-full">
    <a href="{{ '/assets/aster_pipeline.png' | relative_url }}" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/aster_pipeline.png' | relative_url }}" alt="ASTER pipeline: from raw JWST frames to an atmospheric posterior">
    </a>
    <figcaption>Raw frames in, atmosphere out. Click to enlarge.</figcaption>
  </figure>
</section>

<section class="page-card r-section">
  <h2>Why it matters</h2>
  <div class="r-split r-split-even">
    <p>
      Comparative climatology currently rests on the assumption that independently analysed spectra are
      interchangeable. A uniform, open sub-Neptune library replaces that assumption with data that can
      legitimately be compared. And composition is our most direct probe of how these planets formed:
      metallicity and the carbon-to-oxygen ratio record where in a disk a planet assembled, while mean
      molecular weight separates a thin hydrogen layer over a rocky core from a deep, volatile-rich interior.
    </p>
    <p>
      The same measurements decide how the next decade of telescope time is spent. Knowing how many planets
      must be observed, and at what precision, before a trend is detectable is the question Ariel faces now.
      The pipeline and spectral library will be released as open infrastructure for Qu&eacute;bec, Canadian and
      European teams, and carry straight over to the surveys that follow.
    </p>
  </div>
</section>
