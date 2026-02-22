---
layout: default
title: Wasi Naqvi
---

<div class="tabs-app">
  <nav class="tabs-nav" aria-label="Main sections">
    <button class="tab-button active" data-tab="about">About Me</button>
    <button class="tab-button" data-tab="research">Research</button>
    <button class="tab-button" data-tab="blog">Blog Entries</button>
  </nav>

  <section id="about" class="tab-panel active">
    <h2>About Me</h2>
    <p>
      Hi, I’m a first-year graduate student at the Trottier Space Institute at McGill University.
      I completed my Bachelor’s in Physics and Data Science at UBC and currently work on
      exoplanets, with a focus on Bayesian modeling for population-level studies.
    </p>
    <p>
      I love using computational methods to solve physics problems and enjoy building and
      designing experiments. Outside of research, you can find me on a soccer field—or reading
      classical literature and poetry while listening to Hozier.
    </p>
  </section>

  <section id="research" class="tab-panel">
    <h2>Research</h2>
    <ul>
      <li>
        <strong>SIP-CASTOR</strong> — Simulating in-orbit performance for the Canadian Advanced
        Space Telescope for Optical and UV Research.
        <a href="https://github.com/wasnaqvi/SIP-CASTOR" target="_blank" rel="noopener">View project</a>
      </li>
      <li>
        <strong>Numerical Simulations of Stellar Structure</strong> — Comparative stellar models for
        1 M⊙ and 8 M⊙ stars, solved numerically with RK45.
        <a href="https://www.overleaf.com/read/hxpqkghqzycq#fbf443" target="_blank" rel="noopener">Read paper</a>
      </li>
      <li>
        <strong>Finding Exoplanets using TESS</strong> — Transit-method analysis with
        Lightkurve, Astropy, and NumPy.
        <a href="https://github.com/wasnaqvi/Projects/blob/f85bf1c755b30397f9e87ca8d69ead7c4f96bb33/Astronomy/Finding_Exoplanets%20(1).ipynb" target="_blank" rel="noopener">Notebook</a>
      </li>
    </ul>
  </section>

  <section id="blog" class="tab-panel">
    <h2>Blog Entries</h2>
    <p>
      This is your private writing vault in the browser. Add a title and your thoughts below.
      Entries are saved locally on your device and open as expandable cards.
    </p>

    <form id="blog-form" class="blog-form">
      <label for="entry-title">Title</label>
      <input id="entry-title" name="title" type="text" placeholder="e.g., Thoughts on exoplanet populations" required />

      <label for="entry-content">Thoughts</label>
      <textarea id="entry-content" name="content" rows="5" placeholder="Write your entry..." required></textarea>

      <button type="submit">Save entry</button>
    </form>

    <div id="entries" class="entries" aria-live="polite"></div>
  </section>
</div>

<script>
  (() => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const selectedTab = button.dataset.tab;

        tabButtons.forEach((btn) => btn.classList.remove('active'));
        tabPanels.forEach((panel) => panel.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(selectedTab).classList.add('active');
      });
    });

    const STORAGE_KEY = 'wasi_blog_entries';
    const form = document.getElementById('blog-form');
    const entriesEl = document.getElementById('entries');

    const getEntries = () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    };

    const saveEntries = (entries) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    };

    const renderEntries = () => {
      const entries = getEntries();

      if (!entries.length) {
        entriesEl.innerHTML = '<p class="empty-state">No entries yet. Start writing your first thought.</p>';
        return;
      }

      entriesEl.innerHTML = entries
        .map((entry, index) => `
          <details class="entry-card">
            <summary>${entry.title} <span class="entry-date">${entry.date}</span></summary>
            <p>${entry.content.replace(/\n/g, '<br>')}</p>
            <button type="button" class="delete-button" data-index="${index}">Delete</button>
          </details>
        `)
        .join('');

      entriesEl.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', () => {
          const idx = Number(button.dataset.index);
          const updated = getEntries().filter((_, i) => i !== idx);
          saveEntries(updated);
          renderEntries();
        });
      });
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = form.title.value.trim();
      const content = form.content.value.trim();

      if (!title || !content) return;

      const entries = getEntries();
      entries.unshift({
        title,
        content,
        date: new Date().toLocaleDateString(),
      });

      saveEntries(entries);
      form.reset();
      renderEntries();
    });

    renderEntries();
  })();
</script>
