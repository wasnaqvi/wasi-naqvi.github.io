---
layout: default
title: "Wasi Naqvi"
body_class: landing
---

<section class="landing-hero">
  <div class="landing-card">
    <div class="landing-text">
      <h1>Wasi M. F. Naqvi (وصی نقوی)</h1>
      <p class="tagline">Astrophysics Graduate Student · Exoplanetary Atmopheres · Bayesian Modelling</p>
      <p class="email-line">
        <span>Email:</span> <a href="mailto:wasi.naqvi@mail.mcgill.ca">wasi.naqvi@mail.mcgill.ca</a>
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
        <a class="btn" href="{{ '/reads/' | relative_url }}">Reads and Leads</a>
        <a class="btn" href="https://github.com/wasnaqvi" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="btn" href="https://astrobites.org/author/wnaqvi/" target="_blank" rel="noopener noreferrer">Astrobites</a>
      </div>
    </div>
    <div class="landing-photo">
      <img src="{{ '/assets/me.jpg' | relative_url }}" alt="Photo of Wasi Naqvi">
    </div>
  </div>
</section>

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
