// A baby alien that wanders the site. Pixel sprite on a tiny canvas,
// random walk between points in the viewport, idles and blinks between
// walks, hops and says something when clicked. Its position carries over
// between pages (sessionStorage), so it keeps wandering where it left off.
(() => {
  if (window.__babyAlien) return;
  window.__babyAlien = true;

  // 16 x 18 sprite, every row exactly 16 wide. o outline, g skin,
  // l highlight, K lash line, i iris, j lower iris glow, e pupil,
  // w eye sparkle, p cheek, m mouth, a antenna tip, d nappy.
  // The last two rows (feet) alternate while walking.
  const ROWS_OPEN = [
    '..a..........a..',
    '...o........o...',
    '....oooooooo....',
    '...oggggggggo...',
    '..ogllgggggggo..',
    '.oggKKggggKKggo.',
    '.ogewweggewwego.',
    '.ogeweeggeweego.',
    '.ogiiwiggiiwigo.',
    '.oggjjggggjjggo.',
    '..opgggmmgggpo..',
    '...oggggggggo...',
    '....oggggggo....',
    '..oggggggggggo..',
    '...oddddddddo...',
    '....oddddddo....',
  ];
  // Blink: happy closed-eye arcs.
  const ROWS_BLINK = ROWS_OPEN.slice();
  ROWS_BLINK[5] = '.oggggggggggggo.';
  ROWS_BLINK[6] = '.oggKKggggKKggo.';
  ROWS_BLINK[7] = '.ogKggKggKggKgo.';
  ROWS_BLINK[8] = '.oggggggggggggo.';
  ROWS_BLINK[9] = '.oggggggggggggo.';
  const FEET_A = ['....og....go....', '....oo....oo....'];
  const FEET_B = ['.....og..go.....', '.....oo..oo.....'];

  const COLORS = {
    o: '#14244a', g: '#7fb2f2', l: '#d2e6ff', K: '#150f33', i: '#7a3fd6',
    j: '#e7a6ff', e: '#150f33', w: '#ffffff', p: '#f4a3b8', m: '#3b1d2a',
    a: '#f4cf9a', d: '#f2e9d8',
  };
  const W = 16, H = 18;

  function frame(rows, feet) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    rows.concat(feet).forEach((row, y) => {
      for (let x = 0; x < W; x++) {
        const col = COLORS[row[x]];
        if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); }
      }
    });
    return c;
  }
  const FRAMES = {
    standA: frame(ROWS_OPEN, FEET_A),
    standB: frame(ROWS_OPEN, FEET_B),
    blink: frame(ROWS_BLINK, FEET_A),
  };

  const LINES = [
    'gleep!', 'take me to your PI', 'is that a sub-Neptune?', 'mama?',
    'goo goo ga-lactic', 'I come in peace (and nappies)', 'boop',
    'what is a cold trap', 'hehe', 'more JWST time pls', 'zorp?',
  ];

  const css = `
  .baby-alien {
    position: fixed; left: 0; top: 0; z-index: 90;
    width: 48px; height: 54px; padding: 0; margin: 0;
    border: 0; background: none; cursor: pointer;
    will-change: transform;
    -webkit-tap-highlight-color: transparent;
  }
  .baby-alien canvas {
    display: block; width: 48px; height: 54px;
    image-rendering: pixelated; image-rendering: crisp-edges;
    filter: drop-shadow(0 0 10px rgba(127, 178, 242, 0.4));
    transform-origin: 50% 100%;
  }
  .baby-alien.flip canvas { transform: scaleX(-1); }
  .baby-alien .alien-bubble {
    position: absolute; bottom: calc(100% + 6px); left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem 0.55rem;
    font-family: 'VT323', ui-monospace, monospace;
    font-size: 1.15rem; line-height: 1.1; white-space: nowrap;
    color: var(--night, #0e0b16); background: var(--cream, #f2e9d8);
    border: 2px solid var(--amber, #f4cf9a);
    box-shadow: 3px 3px 0 var(--terra-dark, #9a4e2c);
    opacity: 0; pointer-events: none;
    transition: opacity 0.2s steps(2);
  }
  .baby-alien .alien-bubble.show { opacity: 1; }
  .baby-alien .alien-bubble.below { bottom: auto; top: calc(100% + 6px); }
  .baby-alien .alien-bubble.from-left { left: 0; transform: none; }
  .baby-alien .alien-bubble.from-right { left: auto; right: 0; transform: none; }
  @keyframes alien-hop {
    0%, 100% { translate: 0 0; } 40% { translate: 0 -18px; } 70% { translate: 0 -6px; }
  }
  .baby-alien.hop canvas { animation: alien-hop 0.5s ease-out; }
  @media print { .baby-alien { display: none; } }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'baby-alien';
  el.setAttribute('aria-hidden', 'true');
  el.tabIndex = -1;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const bubble = document.createElement('span');
  bubble.className = 'alien-bubble';
  el.append(bubble, cv);
  document.body.appendChild(el);

  const SIZE = { w: 48, h: 54 };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KEY = 'babyAlien.v1';

  const bounds = () => ({
    x0: 8, y0: 70,
    x1: Math.max(8, window.innerWidth - SIZE.w - 8),
    y1: Math.max(70, window.innerHeight - SIZE.h - 8),
  });
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { saved = null; }
  const b0 = bounds();
  const pos = {
    x: saved ? clamp(saved.x * window.innerWidth, b0.x0, b0.x1) : rand(b0.x0, b0.x1),
    y: saved ? clamp(saved.y * window.innerHeight, b0.y0, b0.y1) : b0.y1,
  };
  if (reduce) { pos.x = b0.x0 + 8; pos.y = b0.y1; }

  let target = null, idleUntil = performance.now() + rand(600, 1800);
  let speed = 45, facing = 1, last = performance.now(), stepClock = 0, nextBlink = 0, blinkUntil = 0;

  function pickTarget() {
    const b = bounds();
    // Mostly short strolls, sometimes a long trek across the screen.
    const far = Math.random() < 0.3;
    const r = far ? 2000 : rand(80, 320);
    const ang = Math.random() * Math.PI * 2;
    target = {
      x: clamp(pos.x + Math.cos(ang) * r, b.x0, b.x1),
      y: clamp(pos.y + Math.sin(ang) * r * 0.6, b.y0, b.y1),
    };
    speed = far ? rand(70, 110) : rand(30, 60);
  }

  function draw(now, walking) {
    let f = FRAMES.standA;
    if (now < blinkUntil) f = FRAMES.blink;
    else if (walking) f = Math.floor(stepClock / 0.18) % 2 ? FRAMES.standB : FRAMES.standA;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(f, 0, 0);
    const bob = walking ? (Math.floor(stepClock / 0.18) % 2 ? -2 : 0) : 0;
    el.style.transform = `translate(${pos.x.toFixed(1)}px, ${(pos.y + bob).toFixed(1)}px)`;
    el.classList.toggle('flip', facing < 0);
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    let walking = false;

    if (!reduce && now >= idleUntil) {
      if (!target) pickTarget();
      const dx = target.x - pos.x, dy = target.y - pos.y;
      const d = Math.hypot(dx, dy);
      if (d < 2) {
        target = null;
        idleUntil = now + rand(800, 4000);
        if (Math.random() < 0.35) facing = -facing; // look around
      } else {
        const s = Math.min(d, speed * dt);
        pos.x += (dx / d) * s; pos.y += (dy / d) * s;
        if (Math.abs(dx) > 1) facing = dx > 0 ? 1 : -1;
        stepClock += dt;
        walking = true;
      }
    }
    if (now > nextBlink) { blinkUntil = now + 140; nextBlink = now + rand(2000, 5000); }
    draw(now, walking);
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    const b = bounds();
    pos.x = clamp(pos.x, b.x0, b.x1); pos.y = clamp(pos.y, b.y0, b.y1);
    if (target) { target.x = clamp(target.x, b.x0, b.x1); target.y = clamp(target.y, b.y0, b.y1); }
  });

  const save = () => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ x: pos.x / window.innerWidth, y: pos.y / window.innerHeight }));
    } catch (e) { /* storage unavailable: start fresh next page */ }
  };
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

  let bubbleTimer = 0;
  el.addEventListener('click', () => {
    bubble.textContent = LINES[Math.floor(Math.random() * LINES.length)];
    // Keep the bubble on screen and out from under the nav bar.
    bubble.classList.toggle('below', pos.y < 150);
    bubble.classList.toggle('from-left', pos.x < 120);
    bubble.classList.toggle('from-right', pos.x > window.innerWidth - 200);
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1800);
    el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
    target = null;
    idleUntil = performance.now() + 1600;
  });

  requestAnimationFrame(tick);
})();
