// Research Vault: procedurally drawn pixel-art planets that drift around the
// orbit field. Each planet is a link; hover pauses it, drag flings it.
(() => {
  const field = document.getElementById('orbit-field');
  if (!field) return;
  const planets = Array.from(field.querySelectorAll('.planet'));

  // Palettes run dark -> light; index chosen by noise + lighting.
  const PALETTES = {
    teal:      ['#0d1b2a', '#1b3a57', '#2a6f8f', '#4fa3b8', '#8fd3d1', '#d8f3ec'],
    rust:      ['#2a140c', '#5c2a18', '#9a4e2c', '#c2683d', '#e39a5c', '#f4cf9a'],
    ember:     ['#1f0a1e', '#4a1238', '#8f1f4a', '#d1453b', '#f28a2e', '#ffd36b'],
    ice:       ['#0b0d14', '#1c2233', '#33405e', '#5b6f99', '#a9b8d6', '#eef2fa'],
    verdant:   ['#08161a', '#0f3a3a', '#1f6b55', '#4f9e5c', '#a8cf6a', '#eef3c2'],
  };
  const RING = ['#6b5a45', '#a4947e', '#d9cbb2', '#f2e9d8'];

  // Small seeded value noise, enough for pixel-scale banding.
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

  // Surface styles: how noise maps to a palette index.
  const STYLE = {
    teal:      (n, u, v) => n * 0.5 + 0.5 * (0.5 + 0.5 * Math.sin(v * 9 + n * 4)), // gas bands
    rust:      (n)       => (n > 0.52 ? 0.35 + n * 0.75 : n * 0.55),              // patchy continents
    ember:     (n, u, v) => Math.pow(n, 1.6) + 0.15 * Math.sin(u * 7 + v * 5),     // molten swirls
    ice:       (n, u, v) => n * 0.7 + (Math.abs(v) > 0.72 ? 0.5 : 0),             // icy caps
    verdant:   (n)       => (n > 0.5 ? 0.45 + (n - 0.5) * 1.6 : n * 0.5),          // ocean world, islands
  };

  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  function drawPlanet(ctx, opts, spin) {
    const S = ctx.canvas.width, c = S / 2;
    const R = opts.ring || opts.moon ? S * 0.30 : S * 0.40;
    const pal = PALETTES[opts.palette], style = STYLE[opts.palette];
    const img = ctx.createImageData(S, S), px = img.data;
    const put = (x, y, hex) => {
      const i = (y * S + x) * 4;
      px[i] = parseInt(hex.slice(1, 3), 16); px[i + 1] = parseInt(hex.slice(3, 5), 16);
      px[i + 2] = parseInt(hex.slice(5, 7), 16); px[i + 3] = 255;
    };
    const ringHit = (x, y) => {
      // Tilted ellipse annulus around the planet.
      const dx = x + 0.5 - c, dy = (y + 0.5 - c) * 3.2 + dx * 0.55;
      const r = Math.hypot(dx, dy);
      return r > R * 1.35 && r < R * 1.85 ? r : 0;
    };

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const dx = (x + 0.5 - c) / R, dy = (y + 0.5 - c) / R;
        const d2 = dx * dx + dy * dy;
        const behind = dy < -0.05 * dx; // ring half that sits behind the disc
        if (opts.ring && d2 > 1 && ringHit(x, y)) {
          const r = ringHit(x, y);
          put(x, y, RING[Math.min(3, Math.floor(((r / R) - 1.35) * 8) % 4)]);
          continue;
        }
        if (d2 > 1) continue;
        const z = Math.sqrt(1 - d2);
        // Spherical coords so the texture wraps as it spins.
        const lon = Math.atan2(dx, z) + spin, lat = Math.asin(dy);
        const n = opts.noise(lon * 2.2, lat * 3.0 + 10);
        let t = Math.max(0, Math.min(0.999, style(n, lon, dy)));
        // Light from upper-left, plus ordered dither at the terminator.
        const light = Math.max(0, -dx * 0.55 - dy * 0.45 + z * 0.7);
        const shade = light + (BAYER[y % 4][x % 4] / 16 - 0.5) * 0.28;
        t = t * 0.55 + Math.min(1, shade) * 0.45 + (d2 > 0.86 ? -0.12 : 0);
        put(x, y, pal[Math.max(0, Math.min(pal.length - 1, Math.floor(t * pal.length)))]);
        if (opts.ring && !behind && ringHit(x, y)) {
          const r = ringHit(x, y);
          put(x, y, RING[Math.min(3, Math.floor(((r / R) - 1.35) * 8) % 4)]);
        }
      }
    }

    if (opts.moon) {
      const a = spin * 1.7, mx = c + Math.cos(a) * R * 1.55, my = c + Math.sin(a) * R * 0.7;
      const front = Math.sin(a) > 0, mr = R * 0.22;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const ddx = x + 0.5 - mx, ddy = y + 0.5 - my;
        if (ddx * ddx + ddy * ddy > mr * mr) continue;
        const onDisc = ((x + 0.5 - c) ** 2 + (y + 0.5 - c) ** 2) < R * R;
        if (onDisc && !front) continue;
        put(x, y, ddx + ddy < 0 ? '#d9cbb2' : '#7d6f60');
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = () => window.matchMedia('(max-width: 900px)').matches;

  const bodies = planets.map((el, i) => {
    const canvas = el.querySelector('canvas');
    const opts = {
      palette: el.dataset.palette,
      ring: el.dataset.ring === '1',
      moon: el.dataset.moon === '1',
      noise: makeNoise(+el.dataset.seed || i + 1),
    };
    const ctx = canvas.getContext('2d');
    drawPlanet(ctx, opts, i);
    const ang = Math.random() * Math.PI * 2, speed = 22 + Math.random() * 14;
    return {
      el, ctx, opts, spin: i, spinRate: 0.25 + i * 0.07,
      x: 0, y: 0, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
      hover: false, drag: null, w: 0, h: 0,
    };
  });

  const floating = () => !reduceMotion && !narrow();

  // Planets stay below the page heading so it is never covered.
  const head = field.querySelector('.orbit-head');
  let top = 0;

  function layout() {
    const W = field.clientWidth, H = field.clientHeight;
    top = head && floating() ? head.offsetTop + head.offsetHeight + 16 : 0;
    bodies.forEach(b => { b.w = b.el.offsetWidth; b.h = b.el.offsetHeight; });
    const tallest = Math.max(...bodies.map(b => b.h));
    const rows = H - top >= 2 * tallest ? 2 : 1, cols = Math.ceil(bodies.length / rows);
    bodies.forEach((b, i) => {
      if (!b.placed && floating()) {
        // Start on a loose grid, rows staggered, so nobody overlaps at load.
        const row = Math.floor(i / cols), inRow = row ? bodies.length - cols : cols;
        const cw = W / inRow, ch = (H - top) / rows, col = i % cols;
        b.x = cw * col + Math.max(0, cw - b.w) * (0.2 + Math.random() * 0.6);
        b.y = top + ch * row + Math.max(0, ch - b.h) * (0.2 + Math.random() * 0.6);
        b.placed = true;
      }
      b.x = Math.max(0, Math.min(W - b.w, b.x));
      b.y = Math.max(top, Math.min(H - b.h, b.y));
    });
  }

  function apply() {
    const on = floating();
    field.classList.toggle('is-floating', on);
    bodies.forEach(b => {
      b.el.style.transform = on ? `translate(${b.x}px, ${b.y}px)` : '';
    });
  }

  // Pointer: hover pauses, drag moves and flings on release.
  bodies.forEach(b => {
    const el = b.el;
    el.addEventListener('pointerenter', () => { b.hover = true; el.classList.add('is-hover'); });
    el.addEventListener('pointerleave', () => { b.hover = false; el.classList.remove('is-hover'); });
    el.addEventListener('focus', () => el.classList.add('is-hover'));
    el.addEventListener('blur', () => el.classList.remove('is-hover'));
    el.addEventListener('dragstart', e => e.preventDefault());
    el.addEventListener('pointerdown', e => {
      if (!floating() || e.button !== 0) return;
      b.drag = { px: e.clientX, py: e.clientY, ox: b.x, oy: b.y, moved: 0, t: performance.now(), lx: e.clientX, ly: e.clientY };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', e => {
      if (!b.drag) return;
      const d = b.drag, now = performance.now(), dt = Math.max(1, now - d.t) / 1000;
      b.x = d.ox + e.clientX - d.px; b.y = d.oy + e.clientY - d.py;
      d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.px, e.clientY - d.py));
      b.vx = (e.clientX - d.lx) / dt; b.vy = (e.clientY - d.ly) / dt;
      d.t = now; d.lx = e.clientX; d.ly = e.clientY;
      el.classList.add('is-dragging');
    });
    el.addEventListener('pointerup', () => {
      if (!b.drag) return;
      b.wasDragged = b.drag.moved > 6;
      b.drag = null;
      el.classList.remove('is-dragging');
      const v = Math.hypot(b.vx, b.vy), cap = 900;
      if (v > cap) { b.vx *= cap / v; b.vy *= cap / v; }
    });
    // A drag should not also open the link.
    el.addEventListener('click', e => { if (b.wasDragged) { e.preventDefault(); b.wasDragged = false; } });
  });

  let last = performance.now(), spinAcc = 0;
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const W = field.clientWidth, H = field.clientHeight;

    if (floating()) {
      for (const b of bodies) {
        if (b.drag || b.hover) continue;
        b.x += b.vx * dt; b.y += b.vy * dt;
        // Fling decays back toward a gentle cruising speed.
        const v = Math.hypot(b.vx, b.vy), cruise = 26;
        if (v > cruise) { const k = 1 - Math.min(1, dt * 1.6) * (1 - cruise / v); b.vx *= k; b.vy *= k; }
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
        if (b.y < top) { b.y = top; b.vy = Math.abs(b.vy); }
        if (b.x > W - b.w) { b.x = W - b.w; b.vx = -Math.abs(b.vx); }
        if (b.y > H - b.h) { b.y = H - b.h; b.vy = -Math.abs(b.vy); }
      }
      // Box collisions: separate along the shallower overlap axis and bounce,
      // so labels never sit on top of each other. Held planets act as walls.
      for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], c = bodies[j];
        const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
        const oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
        if (ox <= 0 || oy <= 0) continue;
        const aFree = !a.drag && !a.hover, cFree = !c.drag && !c.hover;
        if (!aFree && !cFree) continue;
        const share = aFree && cFree ? 0.5 : 1;
        if (ox < oy) {
          const s = (a.x < c.x ? -1 : 1) * ox * share;
          if (aFree) { a.x += s; a.vx = Math.sign(s) * Math.abs(a.vx); }
          if (cFree) { c.x -= s; c.vx = -Math.sign(s) * Math.abs(c.vx); }
        } else {
          const s = (a.y < c.y ? -1 : 1) * oy * share;
          if (aFree) { a.y += s; a.vy = Math.sign(s) * Math.abs(a.vy); }
          if (cFree) { c.y -= s; c.vy = -Math.sign(s) * Math.abs(c.vy); }
        }
      }
    }

    // Re-render the surfaces at a low, pixel-art frame rate.
    spinAcc += dt;
    if (!reduceMotion && spinAcc > 1 / 10) {
      for (const b of bodies) { b.spin += b.spinRate * spinAcc; drawPlanet(b.ctx, b.opts, b.spin); }
      spinAcc = 0;
    }

    apply();
    requestAnimationFrame(tick);
  }

  layout();
  apply();
  window.addEventListener('resize', () => { layout(); apply(); });
  requestAnimationFrame(tick);
})();
