---
layout: default
title: "Wasi Naqvi"
---

<nav class="tab-nav">
  <a class="tab-link active" href="#landing">Wasi Naqvi Astrophysics Graduate Student</a>
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
          <p class="tagline">Astrophysics Graduate Student · Exoplanets · Bayesian Modelling</p>
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
          I am a first year graduate student at the Trottier Space Institute at McGill University.
          I work on exoplanets with a focus on Bayesian modelling for population-level studies. I am
          passionate about using computational methods to solve problems in physics and using
          rigorous statistics to tackle fun questions.
        </p>
      </section>

      <section>
        <h2>Projects &amp; Highlights</h2>
        <div class="item">
          <h3>SIP-CASTOR <span class="location">In-development</span></h3>
          <p>Simulating in-orbit performance for the Canadian Advanced Space Telescope for Optical and UV Research using ESA’s Pyxel.</p>
        </div>
        <div class="item">
          <h3>Numerical Simulations of Stellar Structure</h3>
          <p>Compared stellar models for 8 M⊙ and 1 M⊙ stars using Runge-Kutta methods and presented a comparative analysis of flux generation.</p>
        </div>
        <div class="item">
          <h3>Finding Exoplanets with TESS</h3>
          <p>Used lightkurve, astropy, and numpy to detect exoplanets in Kepler and TESS data via the transit method.</p>
        </div>
        <div class="item">
          <h3>Plots, Plots, Plots</h3>
          <p>Assorted plots from Gaia EDR3 data to population growth curves in a notebook of visualization experiments.</p>
        </div>
        <div class="item">
          <h3>Investigating Myopia in Children</h3>
          <p>Built a classification model in R to study the Orinda Longitudinal Study of Myopia and predict juvenile myopia onset.</p>
        </div>
        <div class="item">
          <h3>Ongoing Projects</h3>
          <p>Building a generalizable pipeline for detector simulations and exploring an M-Sigma clustering algorithm for mass segregation in globular clusters.</p>
        </div>
      </section>
    </div>
  </section>

  <section id="blog" class="tab-panel">
    <div class="main-content">
      <section class="about-me">
        <h2>About Me</h2>
        <p>[Write your about me section here.]</p>
      </section>

      <section>
        <h2>Research Vault</h2>
        <p class="vault-intro">
          Add new vault entries by copying a card and updating the title, date, and content.
        </p>
        <div class="vault-grid">
          <details class="vault-card">
            <summary>
              <span class="vault-title">Vault Entry Title</span>
              <span class="vault-meta">Date · Topic</span>
            </summary>
            <div class="vault-body">
              <p>
                [Write your thoughts here. You can include images or video below.]
              </p>
              <img src="{{ '/assets/background_2.jpg' | relative_url }}" alt="Optional vault image">
            </div>
          </details>

          <details class="vault-card">
            <summary>
              <span class="vault-title">Another Vault Entry</span>
              <span class="vault-meta">Date · Topic</span>
            </summary>
            <div class="vault-body">
              <p>
                [Add notes, figures, or embed a short clip.]
              </p>
            </div>
          </details>

          <details class="vault-card">
            <summary>
              <span class="vault-title">Text-Only Entry</span>
              <span class="vault-meta">Date · Topic</span>
            </summary>
            <div class="vault-body">
              <p>
                [Use this template when you want a clean entry with no media.]
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
          <a href="https://docs.google.com/spreadsheets/d/1wwGB_lXNU2i0vjGP9xKBcIS516CSrn0RlMtG7bSGcow/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
            My complete reading list
          </a>
        </p>
      </section>

      <section>
        <h2>Currently Reading</h2>
        <ul class="list-plain">
          <li>[Add current book or paper.]</li>
          <li>[Add another title.]</li>
        </ul>
      </section>

      <section>
        <h2>What I’m Up To</h2>
        <ul class="list-plain">
          <li>[Add a current project or hobby.]</li>
          <li>[Add another update.]</li>
        </ul>
      </section>

      <section>
        <h2>Hobbies &amp; Curiosities</h2>
        <ul class="list-plain">
          <li>[Add a hobby or interest.]</li>
        </ul>
      </section>
    </div>
  </section>
</div>

<script>
  const links = document.querySelectorAll('.tab-link');
  const panels = document.querySelectorAll('.tab-panel');

  function activateTab(hash) {
    const target = hash || '#landing';
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === target);
    });
    panels.forEach((panel) => {
      panel.classList.toggle('active', `#${panel.id}` === target);
    });
  }

  window.addEventListener('hashchange', () => activateTab(window.location.hash));
  activateTab(window.location.hash);
</script>
