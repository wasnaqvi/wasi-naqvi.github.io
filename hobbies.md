---
layout: default
title: "Research Vault"
permalink: /hobbies/
body_class: research
---

<section class="page-card vault-hero">
  <div>
    <h1>Research Vault</h1>
    <p class="hint">Software and notebooks, all open source. Each planet is a repository: hover to read it, drag to fling it, click to open it on GitHub.</p>
  </div>
  <img class="vault-headshot" src="{{ '/Website_Pictures/Headshot_2.jpeg' | relative_url }}" alt="Wasi Naqvi">
</section>

<section class="page-card orbit-card">
  <div class="orbit-field" id="orbit-field">

    <a class="planet" href="https://github.com/wasnaqvi/HERMES" target="_blank" rel="noopener noreferrer"
       data-palette="hermes" data-ring="1" data-seed="11">
      <canvas class="planet-px" width="40" height="40" aria-hidden="true"></canvas>
      <span class="planet-label">
        <span class="planet-name">HERMES</span>
        <span class="planet-desc">Hierarchical Bayesian modelling that forecasts what a population-level survey like Ariel can learn about exoplanet atmospheres.</span>
      </span>
    </a>

    <a class="planet" href="https://github.com/wasnaqvi/maiea" target="_blank" rel="noopener noreferrer"
       data-palette="patchwork" data-seed="27">
      <canvas class="planet-px" width="40" height="40" aria-hidden="true"></canvas>
      <span class="planet-label">
        <span class="planet-name">Patchwork</span>
        <span class="planet-desc">An agentic pipeline that turns raw JWST NIRSpec/G395H frames into uniform transmission spectra for a sub-Neptune survey.</span>
      </span>
    </a>

    <a class="planet" href="https://github.com/wasnaqvi/SIMORGH" target="_blank" rel="noopener noreferrer"
       data-palette="simorgh" data-seed="43">
      <canvas class="planet-px" width="40" height="40" aria-hidden="true"></canvas>
      <span class="planet-label">
        <span class="planet-name">SIMORGH</span>
        <span class="planet-desc">Simulation-based inference that retrieves a sub-Neptune atmosphere in about a second, with calibration tests that show whether to trust the posterior.</span>
      </span>
    </a>

    <a class="planet" href="https://github.com/wasnaqvi/magpie" target="_blank" rel="noopener noreferrer"
       data-palette="magpie" data-moon="1" data-seed="59">
      <canvas class="planet-px" width="40" height="40" aria-hidden="true"></canvas>
      <span class="planet-label">
        <span class="planet-name">MAGPIE</span>
        <span class="planet-desc">An X/Twitter search console for social-science students that verifies every link it finds, so the results can be cited.</span>
      </span>
    </a>

  </div>
</section>

<script src="{{ '/assets/vault-planets.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
