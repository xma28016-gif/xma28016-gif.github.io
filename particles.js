'use strict';
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('#animation-toggle');
  const colors = ['#8052ff', '#a57bff', '#ffb829', '#15846e', '#419ea0', '#cc5ca6', '#5274ff'];
  let paused = false;
  let visible = true;
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;

  function randomSource(seed) {
    return () => {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let n = Math.imul(seed ^ seed >>> 15, 1 | seed);
      n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n;
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }

  function createField(canvas, mode) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const random = randomSource(mode === 'brain' ? 4627 : 9241);
    const points = [];
    const count = mode === 'brain' ? 2500 : 1250;
    for (let i = 0; i < count; i++) {
      let x, y, z;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      if (mode === 'brain') {
        const side = i % 2 ? 1 : -1;
        const fold = 1 + .055 * Math.sin(theta * 11 + phi * 8) + .045 * Math.cos(phi * 14 - theta * 5);
        const depth = random() < .77 ? 1 : .7 + random() * .3;
        x = side * (.075 + Math.abs(Math.cos(theta) * Math.sin(phi)) * .98) * fold;
        y = Math.cos(phi) * .92 * fold;
        z = Math.sin(theta) * Math.sin(phi) * .72 * fold;
        x *= depth; y *= depth; z *= depth;
        // A gently lobed silhouette and central furrow give the cloud its organic shape.
        y += .07 * Math.cos(x * 2.8) - .07 * Math.abs(z);
      } else {
        const ring = theta;
        const tube = random() * Math.PI * 2;
        const radius = .74 + Math.cos(tube) * .24;
        x = Math.cos(ring) * radius;
        y = Math.sin(ring) * radius;
        z = Math.sin(tube) * .24;
      }
      points.push({ x, y, z, color: colors[Math.floor(random() * colors.length)], size: .8 + random() * 1.7, rotation: random() * Math.PI * 2, phase: random() * Math.PI * 2, brightness: .72 + random() * .28 });
    }
    const ambient = Array.from({ length: mode === 'brain' ? 100 : 35 }, () => ({ x: random(), y: random(), color: colors[Math.floor(random() * colors.length)], size: .8 + random() * 1.2, phase: random() * 6.28 }));
    let width = 0;
    let height = 0;

    function triangle(x, y, size, rotation, color, alpha) {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = rotation + i * Math.PI * 2 / 3;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.stroke();
    }

    function draw(time = 0) {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width * .405, height * .38);
      const yaw = mode === 'brain' ? -.35 + Math.sin(time * .00013) * .18 + pointerX * .08 : .42;
      const tilt = mode === 'brain' ? -.24 + pointerY * .025 : -.42;
      const pitch = mode === 'brain' ? .2 : 1.01;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      for (const p of ambient) {
        const drift = Math.sin(time * .00015 + p.phase) * 3;
        triangle(p.x * width, p.y * height + drift, p.size, p.phase, p.color, .45);
      }
      const projected = points.map(p => {
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y1 = p.y * cp - z1 * sp;
        const z2 = p.y * sp + z1 * cp;
        const x2 = x1 * ct - y1 * st;
        const y2 = x1 * st + y1 * ct;
        const perspective = 3.8 / (3.8 - z2);
        return { p, z: z2, x: width * .51 + x2 * scale * perspective, y: height * .49 + y2 * scale * perspective + Math.sin(time * .00035 + p.phase) * 1.2, perspective };
      }).sort((a, b) => a.z - b.z);
      for (const item of projected) {
        const alpha = Math.min(1, (.68 + (item.z + 1) * .18) * item.p.brightness);
        triangle(item.x, item.y, item.p.size * item.perspective, item.p.rotation + time * .000025, item.p.color, alpha);
      }
      ctx.globalAlpha = 1;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(elapsed);
    }
    new ResizeObserver(resize).observe(canvas);
    resize();
    return { draw };
  }

  const heroCanvas = document.querySelector('#hero-particles');
  const hero = createField(heroCanvas, 'brain');
  createField(document.querySelector('#about-particles'), 'orbit');
  if (!hero) return;

  function canAnimate() { return !paused && !motionPreference.matches && visible && !document.hidden; }
  function animate(time) {
    frame = 0;
    if (!canAnimate()) { previousTime = 0; return; }
    if (!previousTime) previousTime = time;
    if (time - previousTime >= 40) {
      elapsed += Math.min(time - previousTime, 80);
      previousTime = time;
      hero.draw(elapsed);
    }
    frame = requestAnimationFrame(animate);
  }
  function synchronize() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; previousTime = 0;
    toggle.disabled = motionPreference.matches;
    toggle.setAttribute('aria-pressed', String(paused || motionPreference.matches));
    toggle.setAttribute('aria-label', motionPreference.matches ? '已遵循系统减少动态效果设置' : paused ? '播放粒子动画' : '暂停粒子动画');
    toggle.innerHTML = motionPreference.matches ? '静态模式' : paused ? '播放动效 <span aria-hidden="true">▷</span>' : '暂停动效 <span aria-hidden="true">Ⅱ</span>';
    if (canAnimate()) frame = requestAnimationFrame(animate);
    else hero.draw(elapsed);
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; synchronize(); });
  motionPreference.addEventListener('change', synchronize);
  document.addEventListener('visibilitychange', synchronize);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; synchronize(); }, { threshold: .02 }).observe(heroCanvas);
  document.querySelector('.hero').addEventListener('pointermove', event => {
    if (!canAnimate() || event.pointerType === 'touch') return;
    const rect = heroCanvas.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
  }, { passive: true });
  synchronize();
})();
