---
layout: default
title: "Wasi Naqvi"
body_class: landing
---

<section class="landing-hero">
  <div class="landing-card">
    <div class="landing-text reveal visible">
      <p class="kicker">McGill University · Trottier Space Institute</p>
      <h1>Wasi M. F. Naqvi (وصی نقوی)</h1>
      <p class="tagline">
        Astrophysics Graduate Student
        <span class="sep">·</span> Exoplanetary Atmospheres
        <span class="sep">·</span> Artificial Intelligence
      </p>
      <p class="email-line">
        <a href="mailto:wasi.naqvi@mail.mcgill.ca">wasi.naqvi@mail.mcgill.ca</a>
      </p>
      <div class="name-audio">
        <button class="audio-line" type="button" id="play-name">
          Hear my name
          <span class="waveform" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </span>
        </button>
        <audio id="name-audio" src="{{ '/assets/Wasi.mp3' | relative_url }}"></audio>
      </div>
      <div class="landing-buttons">
        <a class="btn primary" href="{{ '/research/' | relative_url }}">My Research</a>
        <a class="btn" href="{{ '/blog/' | relative_url }}">Blog</a>
        <a class="btn" href="{{ '/reads/' | relative_url }}">Reads &amp; Leads</a>
        <a class="btn" href="https://github.com/wasnaqvi" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="btn" href="https://astrobites.org/author/wnaqvi/" target="_blank" rel="noopener noreferrer">Astrobites</a>
      </div>
    </div>
    <div class="landing-photo reveal visible">
      <img src="{{ '/assets/me.jpg' | relative_url }}" alt="Photo of Wasi Naqvi">
    </div>
  </div>
</section>

<section class="log-section home-log reveal">
  <div class="log-header">
    <h2>Latest from the Research Log</h2>
    <a class="log-all" href="https://wasinaqvi.blogspot.com" target="_blank" rel="noopener noreferrer">All posts →</a>
  </div>
  <div class="log-grid" id="log-grid" data-max="3">
    <p class="log-status">Loading latest posts…</p>
  </div>
</section>

<section class="log-section home-log reveal">
  <div class="log-header">
    <h2>Latest from Astrobites</h2>
    <a class="log-all" href="https://astrobites.org/author/wnaqvi/" target="_blank" rel="noopener noreferrer">All posts &rarr;</a>
  </div>
  <div class="log-grid">
    <a class="log-card reveal visible" href="https://astrobites.org/2026/08/13/the-dying-of-the-light/" target="_blank" rel="noopener noreferrer">
      <span class="log-date">August 13, 2026</span>
      <span class="log-title">The Dying of the Light</span>
      <span class="log-snippet">Funding cuts are switching off telescopes while orbital data centres brighten the sky. On what we stand to lose, and what can still be done about it.</span>
      <span class="log-more">Read on Astrobites &rarr;</span>
    </a>
    <a class="log-card reveal visible" href="https://astrobites.org/2026/04/10/tell-me-why-a-case-for-humane-astrophysics/" target="_blank" rel="noopener noreferrer">
      <span class="log-date">April 10, 2026</span>
      <span class="log-title">Tell Me Why? A Case for Human(e) Astrophysics</span>
      <span class="log-snippet">Why we do astrophysics at all, what machines should and should not take over, and the argument that people are always the ends and never merely the means.</span>
      <span class="log-more">Read on Astrobites &rarr;</span>
    </a>
  </div>
</section>

{% include blogger_feed.html %}

<script>
  const playButton = document.getElementById('play-name');
  const nameAudio = document.getElementById('name-audio');
  if (playButton && nameAudio) {
    playButton.addEventListener('click', () => {
      nameAudio.currentTime = 0;
      nameAudio.play();
      playButton.classList.add('playing');
    });
    nameAudio.addEventListener('ended', () => {
      playButton.classList.remove('playing');
    });
  }
</script>
