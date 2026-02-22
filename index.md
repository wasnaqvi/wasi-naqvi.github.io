---
layout: default
title: "Wasi Naqvi"
---

<nav class="tab-nav">
  <a class="tab-link active" href="#landing">Hi, This is Wasi, Welcome to my website!!</a>
  <a class="tab-link" href="#research">My Research</a>
  <a class="tab-link" href="#blog">My Research Blog</a>
  <a class="tab-link" href="#reads">Reads and Leads</a>
</nav>

<div class="tab-panels">
  <section id="landing" class="tab-panel">
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1>Wasi Naqvi</h1>
          <p class="tagline">
            Exoplanets · Hierarchical Bayesian Modelling · Instrumentation
          </p>
          <p class="email-line">
            <span>Email:</span> <a href="mailto:wasi.naqvi@mail.mcgill.ca">wasi.naqvi@mail.mcgill.ca</a>
          </p>
          <p class="hero-buttons">
            <a class="btn primary" href="#research">My Research</a>
            <a class="btn" href="#blog">My Research Blog</a>
            <a class="btn" href="#reads">Reads and Leads</a>
          </p>
        </div>
        <div class="hero-photo">
          <img src="{{ '/assets/me.jpg' | relative_url }}" alt="Photo of Wasi Naqvi">
        </div>
      </div>
    </div>
  </section>

  <section id="research" class="tab-panel">
    <div class="main-content">
      <section>
        <h2>Research Focus</h2>
        <p>
          I work at the intersection of exoplanet atmospheres, hierarchical Bayesian modelling, and
          instrumentation. My current research focuses on population-level trends for ESA’s
          <strong>ARIEL</strong> mission, using multidimensional models to understand planetary demographics.
        </p>
      </section>

      <section>
        <h2>Academic Background</h2>
        <div class="item">
          <h3>McGill University <span class="location">Montreal, QC</span></h3>
          <p>Hierarchical Bayesian modelling of planetary targets to probe population-level trends for the
            <strong>ARIEL Space Mission</strong>.
          </p>
        </div>
        <div class="item">
          <h3>The University of British Columbia <span class="location">Vancouver, BC</span></h3>
          <p>Bachelor’s degree in Physics and Astronomy.</p>
        </div>
      </section>

      <section>
        <h2>Selected Experience</h2>
        <div class="item">
          <h3>McGill Summer Intern — Trottier Institute for Research on Exoplanets
            <span class="location">Montreal, QC · 05/2025–Present</span>
          </h3>
          <ul>
            <li>Hierarchical Bayesian modelling of planetary targets for the ARIEL mission.</li>
            <li>Developing population-level trends for exoplanet atmospheres and demographics.</li>
          </ul>
        </div>
        <div class="item">
          <h3>Junior Adaptive Optics Research Scientist — NRC Herzberg Astronomy and Astrophysics
            <span class="location">Victoria, BC · 01/2025–Present</span>
          </h3>
          <ul>
            <li>Implementing CNNs on the adaptive optics system test bench for the 1.2 m REVOLT Telescope.</li>
            <li>Machine-learning simulations and experiments in the Adaptive Optics Lab under Dr. Maaike von Kooten.</li>
          </ul>
        </div>
      </section>
    </div>
  </section>

  <section id="blog" class="tab-panel">
    <div class="main-content">
      <section class="about-me">
        <h2>About Me</h2>
        <p>
          [Write your about me here.]
        </p>
      </section>

      <section>
        <h2>Research Vault</h2>
        <p class="vault-intro">
          Drop thoughts, sketches, plots, or photos into the vault. Each capsule opens into a deeper note.
        </p>
        <div class="vault-grid">
          <details class="vault-card">
            <summary>
              <span class="vault-title">ARIEL Population Note</span>
              <span class="vault-meta">08 Feb 2026 · Analysis</span>
            </summary>
            <div class="vault-body">
              <p>
                Short note on multivariate priors for atmospheric composition. Add figures, links,
                or embed a short clip here.
              </p>
              <img src="{{ '/assets/background_2.jpg' | relative_url }}" alt="Placeholder exoplanet image">
            </div>
          </details>

          <details class="vault-card">
            <summary>
              <span class="vault-title">Lab Bench Snapshot</span>
              <span class="vault-meta">23 Jan 2026 · Instrumentation</span>
            </summary>
            <div class="vault-body">
              <p>
                Instrument alignment checklist and a quick video note about calibration drift.
              </p>
              <img src="{{ '/assets/reading.jpg' | relative_url }}" alt="Placeholder lab image">
            </div>
          </details>

          <details class="vault-card">
            <summary>
              <span class="vault-title">Model Debug Log</span>
              <span class="vault-meta">14 Jan 2026 · Bayesian Modelling</span>
            </summary>
            <div class="vault-body">
              <p>
                Posterior divergence notes, version pins, and a reminder to check priors on metallicity.
              </p>
            </div>
          </details>
        </div>
      </section>
    </div>
  </section>

  <section id="reads" class="tab-panel">
    <div class="main-content">
      <section>
        <h2>Reads and Leads</h2>
        <p>
          A running list of what I’m up to, what I’m reading, and the ideas I want to chase next.
        </p>
      </section>

      <section>
        <h2>Currently Reading</h2>
        <ul class="list-plain">
          <li>Exoplanet atmospheres and retrieval literature (papers + mission updates).</li>
          <li>Bayesian workflow notes and uncertainty calibration references.</li>
          <li>Adaptive optics system modeling notes.</li>
        </ul>
      </section>

      <section>
        <h2>What I’m Up To</h2>
        <ul class="list-plain">
          <li>Building a clean pipeline for population-level inference.</li>
          <li>Writing experiments for instrument calibration stability.</li>
          <li>Mentoring new students on analysis workflows.</li>
        </ul>
      </section>

      <section>
        <h2>Hobbies &amp; Curiosities</h2>
        <ul class="list-plain">
          <li>Sketching exoplanet maps and data-visualization concepts.</li>
          <li>Long walks with podcasts on science history.</li>
          <li>Collecting notes on how to teach complex ideas simply.</li>
        </ul>
      </section>
    </div>
  </section>
</div>

<script>
  const links = document.querySelectorAll(".tab-link");
  const panels = document.querySelectorAll(".tab-panel");

  function activateTab(hash) {
    const target = hash || "#landing";
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === target);
    });
    panels.forEach((panel) => {
      panel.classList.toggle("active", `#${panel.id}` === target);
    });
  }

  window.addEventListener("hashchange", () => activateTab(window.location.hash));
  activateTab(window.location.hash);
</script>
