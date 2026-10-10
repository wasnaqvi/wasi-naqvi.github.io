// Research page: small pixel-art planets for the three sub-Neptune
// possibilities. Same look as the Research Software planets: low-res
// canvas, ordered dither, slow spin. Each also breathes a little (halo or
// lava glow), and the canvas bobs in CSS, all inside its card.
(() => {
  const canvases = Array.from(document.querySelectorAll('canvas.r-px'));
  if (!canvases.length) return;

  function makeNoise(seed) {
    let s = seed * 9301 + 49297;
    const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const N = 64, grid = Array.from({ length: N * N }, rand);
    const at = (x, y) => grid[((y % N + N) % N) * N + ((x % N + N) % N)];
    const smooth = t => t * t * (3 - 2 * t);
    const v = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = smooth(x - xi), yf = smooth(y - yi);
      const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    };
    return (x, y) => 0.6 * v(x, y) + 0.3 * v(x * 2.1, y * 2.1) + 0.1 * v(x * 4.3, y * 4.3);
  }

  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

  // radius: disc size as a fraction of the canvas; halo: atmosphere
  // thickness in planet radii (0 = airless).
  const KINDS = {
    rocky: {
      seed: 5, radius: 0.38, halo: 0.16, haloColor: '#9fd0e6',
      pal: ['#1a1716', '#3a3330', '#5e544d', '#8a7d70', '#b8a998', '#e2d6c4'],
      surface: n => (n > 0.55 ? 0.3 + n * 0.8 : n * 0.7),   // rocky patches
    },
    water: {
      seed: 17, radius: 0.33, halo: 0.36, haloColor: '#e6f2f7',
      pal: ['#06152b', '#0b2b52', '#134a80', '#2f74ad', '#6aa7d4', '#e9f3f8'],
      surface: (n, lon, lat, n2) => (n2 > 0.6 ? 0.92 : n * 0.75), // ocean + steam clouds
    },
    lava: {
      seed: 29, radius: 0.37, halo: 0, lava: true,
      pal: ['#080506', '#130b0a', '#21130f', '#2f1c16', '#3f261d', '#523226'],
      glow: ['#6e1a0b', '#a8300f', '#d9531b', '#f58a2c', '#ffc35a'],
      surface: n => n * 0.9,
    },
  };

  function draw(ctx, k, spin, pulse) {
    const S = ctx.canvas.width, c = S / 2, R = S * k.radius;
    const img = ctx.createImageData(S, S), px = img.data;
    const put = (x, y, col, a = 255) => {
      const i = (y * S + x) * 4, [r, g, b] = rgb(col);
      px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a;
    };

    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = (x + 0.5 - c) / R, dy = (y + 0.5 - c) / R;
      const d = Math.hypot(dx, dy), dither = BAYER[y % 4][x % 4] / 16;
      const lit = Math.max(0, 0.6 - dx * 0.5 - dy * 0.4);

      if (d > 1) {
        // Atmosphere: banded halo (solid, then checkerboard) that breathes.
        const checker = (x + y) % 2 === 0;
        if (k.halo && d < 1 + k.halo) {
          const f = (1 - (d - 1) / k.halo) * (0.6 + 0.4 * lit) * pulse;
          if (f > 0.62) put(x, y, k.haloColor, 230);
          else if (f > 0.3 && checker) put(x, y, k.haloColor, 150);
        }
        // Lava planets glow faintly at the rim instead.
        if (k.lava && d < 1.1 && checker && pulse > 0.85) put(x, y, k.glow[1], 170);
        continue;
      }

      const z = Math.sqrt(1 - d * d);
      const lon = Math.atan2(dx, z) + spin, lat = Math.asin(dy);
      const n = k.noise(lon * 2.2, lat * 3 + 10);
      const n2 = k.noise(lon * 3.1 + 40, lat * 4.5 + 3);

      if (k.lava) {
        // Glowing cracks along noise contours; self-lit, so not shaded.
        const edge = Math.abs(n - 0.5);
        if (edge < 0.042) {
          // Hottest at the crack's centre; the whole network pulses.
          const heat = (1 - edge / 0.042) * (0.55 + 0.45 * pulse) + (dither - 0.5) * 0.2;
          put(x, y, k.glow[Math.max(0, Math.min(k.glow.length - 1, Math.floor(heat * k.glow.length)))]);
          continue;
        }
      }

      let t = Math.max(0, Math.min(0.999, k.surface(n, lon, lat, n2)));
      const shade = Math.max(0, -dx * 0.55 - dy * 0.45 + z * 0.7) + (dither - 0.5) * 0.28;
      t = t * 0.55 + Math.min(1, shade) * 0.45 + (d > 0.9 ? -0.12 : 0);
      put(x, y, k.pal[Math.max(0, Math.min(k.pal.length - 1, Math.floor(t * k.pal.length)))]);
    }
    ctx.putImageData(img, 0, 0);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const planets = canvases.map((cv, i) => {
    const k = KINDS[cv.dataset.kind];
    if (!k) return null;
    k.noise = makeNoise(k.seed);
    const p = { ctx: cv.getContext('2d'), k, spin: i * 1.3, rate: 0.22 + i * 0.05, phase: i * 1.7 };
    draw(p.ctx, k, p.spin, 1);
    return p;
  }).filter(Boolean);

  if (reduceMotion) return;
  let last = performance.now(), acc = 0;
  (function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now; acc += dt;
    // Pixel-art frame rate, like the Research Software planets.
    if (acc > 1 / 10) {
      for (const p of planets) {
        p.spin += p.rate * acc;
        const pulse = 0.82 + 0.18 * Math.sin(now / 700 + p.phase);
        draw(p.ctx, p.k, p.spin, pulse);
      }
      acc = 0;
    }
    requestAnimationFrame(tick);
  })(last);
})();
