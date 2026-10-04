/* ============================================
   DHIRAJ Portfolio — Interactions
   ============================================ */

// ---------- Custom cursor ----------
(function() {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;
  window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // hover affordances
  document.addEventListener('pointerover', e => {
    const t = e.target;
    if (t.closest('a, button, .stat, .skill-group, .post, .test-card, .role-chip, .project, .stat')) {
      ring.classList.add('hover');
    } else if (t.closest('h1, h2, h3, p')) {
      ring.classList.add('text-hover');
    }
  });
  document.addEventListener('pointerout', () => {
    ring.classList.remove('hover');
    ring.classList.remove('text-hover');
  });
})();

// ---------- Magnetic buttons ----------
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width/2);
    const y = e.clientY - (r.top + r.height/2);
    el.style.transform = `translate(${x*0.25}px, ${y*0.4}px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
});

// ---------- Scroll reveals ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Parallax shapes ----------
const shapes = document.querySelectorAll('.shape[data-parallax]');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  shapes.forEach(s => {
    const sp = parseFloat(s.dataset.parallax) || 0.2;
    s.style.translate = `0 ${y * sp}px`;
  });
});

// ---------- Project hover preview ----------
(function() {
  const preview = document.querySelector('.preview');
  if (!preview) return;
  const inner = preview.querySelector('.preview-inner');
  const projects = document.querySelectorAll('.project');

  projects.forEach(p => {
    p.addEventListener('pointerenter', () => {
      preview.classList.add('show');
      inner.textContent = p.dataset.preview || p.querySelector('.title').textContent;
      inner.style.background = p.dataset.color || '#FFB99A';
    });
    p.addEventListener('pointerleave', () => preview.classList.remove('show'));
  });

  let px = 0, py = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', e => {
    tx = e.clientX + 30;
    ty = e.clientY - 110;
  });
  function moveLoop() {
    px += (tx - px) * 0.18;
    py += (ty - py) * 0.18;
    preview.style.transform = `translate(${px}px, ${py}px) rotate(-3deg)`;
    requestAnimationFrame(moveLoop);
  }
  moveLoop();
})();

// ---------- Text scramble on hero ----------
(function() {
  const el = document.querySelector('[data-scramble]');
  if (!el) return;
  const finalText = el.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#';
  let frame = 0;

  function scramble(text) {
    return text.split('').map((c, i) => {
      if (frame > i * 1.5) return c;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
  }
  function loop() {
    el.textContent = scramble(finalText);
    frame++;
    if (frame < finalText.length * 2) requestAnimationFrame(loop);
    else el.textContent = finalText;
  }
  // start after small delay so user sees the effect
  setTimeout(loop, 300);
})();

// ---------- Draggable stickers / cards ----------
function makeDraggable(el) {
  let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
  const cs = getComputedStyle(el);
  // capture initial transform
  let baseTransform = cs.transform === 'none' ? '' : cs.transform;
  let dx = 0, dy = 0;

  el.addEventListener('pointerdown', e => {
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    ox = dx; oy = dy;
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = 100;
    el.style.transition = 'none';
  });
  el.addEventListener('pointermove', e => {
    if (!dragging) return;
    dx = ox + (e.clientX - sx);
    dy = oy + (e.clientY - sy);
    el.style.transform = `${baseTransform} translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('pointerup', () => {
    dragging = false;
    el.style.transition = 'transform .6s cubic-bezier(.2,.9,.3,1.4)';
  });
}
document.querySelectorAll('[data-draggable]').forEach(makeDraggable);

// ---------- Playground particle canvas ----------
(function() {
  const canvas = document.getElementById('playCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;

  function size() {
    const r = canvas.getBoundingClientRect();
    w = canvas.width = r.width * devicePixelRatio;
    h = canvas.height = r.height * devicePixelRatio;
    canvas.style.height = r.height + 'px';
  }
  size();
  window.addEventListener('resize', size);

  const colors = ['#FF6B5B', '#F2B33D', '#FFB99A', '#8FD1B8', '#B8A4D4'];
  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (8 + Math.random() * 24) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.6 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.6 * devicePixelRatio,
      shape: Math.floor(Math.random() * 4),
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
    });
  }

  let mx = -1000, my = -1000;
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) * devicePixelRatio;
    my = (e.clientY - r.top) * devicePixelRatio;
  });
  canvas.addEventListener('pointerleave', () => { mx = my = -1000; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      // mouse repel
      const dx = p.x - mx, dy = p.y - my;
      const d = Math.hypot(dx, dy);
      if (d < 140 * devicePixelRatio) {
        const f = (140 * devicePixelRatio - d) / (140 * devicePixelRatio);
        p.vx += (dx / d) * f * 0.6;
        p.vy += (dy / d) * f * 0.6;
      }
      p.vx *= 0.96; p.vy *= 0.96;
      p.x += p.vx; p.y += p.vy;
      p.rot += p.vr;

      // wrap
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#1A1410';
      ctx.lineWidth = 2 * devicePixelRatio;
      if (p.shape === 0) { // circle
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      } else if (p.shape === 1) { // square
        ctx.fillRect(-p.r, -p.r, p.r*2, p.r*2);
        ctx.strokeRect(-p.r, -p.r, p.r*2, p.r*2);
      } else if (p.shape === 2) { // triangle
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.lineTo(p.r, p.r);
        ctx.lineTo(-p.r, p.r);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else { // squiggle line
        ctx.beginPath();
        ctx.moveTo(-p.r, 0);
        ctx.quadraticCurveTo(-p.r/2, -p.r, 0, 0);
        ctx.quadraticCurveTo(p.r/2, p.r, p.r, 0);
        ctx.lineWidth = 3 * devicePixelRatio;
        ctx.stroke();
      }
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---------- Confetti ----------
(function() {
  const btn = document.getElementById('confettiBtn');
  if (!btn) return;
  const colors = ['#FF6B5B', '#F2B33D', '#FFB99A', '#8FD1B8', '#B8A4D4', '#FFF4E6'];

  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    for (let i = 0; i < 80; i++) {
      const c = document.createElement('div');
      const size = 8 + Math.random() * 14;
      c.style.cssText = `
        position: fixed;
        left: ${cx}px;
        top: ${cy}px;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random()*colors.length)]};
        border: 2px solid #1A1410;
        border-radius: ${Math.random() < 0.5 ? '999px' : '3px'};
        pointer-events: none;
        z-index: 9998;
        will-change: transform, opacity;
      `;
      document.body.appendChild(c);

      const angle = Math.random() * Math.PI * 2;
      const vel = 200 + Math.random() * 400;
      const vx = Math.cos(angle) * vel;
      const vy = Math.sin(angle) * vel - 200;
      const rot = (Math.random() - 0.5) * 720;

      c.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy + 600}px)) rotate(${rot}deg)`, opacity: 0 }
      ], {
        duration: 1400 + Math.random() * 600,
        easing: 'cubic-bezier(.2,.9,.4,1)'
      }).onfinish = () => c.remove();
    }
  });
})();

// ---------- Time / now ----------
(function() {
  const el = document.getElementById('liveTime');
  if (!el) return;
  function tick() {
    const d = new Date();
    const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' };
    el.textContent = d.toLocaleTimeString('en-GB', opts) + ' IST';
  }
  tick();
  setInterval(tick, 1000);
})();

// ---------- Marquee duplicate (for seamless loop) ----------
document.querySelectorAll('.marquee-track').forEach(t => {
  t.innerHTML = t.innerHTML + t.innerHTML;
});

// ---------- Page transition on case-study links ----------
document.querySelectorAll('[data-transition]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    e.preventDefault();
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: #1A1410;
      z-index: 9997;
      transform: translateY(100%);
      transition: transform .55s cubic-bezier(.7,0,.3,1);
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.transform = 'translateY(0)');
    setTimeout(() => window.location.href = href, 550);
  });
});

// ---------- Initial page reveal ----------
window.addEventListener('load', () => {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0;
    background: #1A1410;
    z-index: 9997;
    transform: translateY(0);
    transition: transform .8s cubic-bezier(.7,0,.3,1);
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.transform = 'translateY(-100%)';
    setTimeout(() => overlay.remove(), 800);
  });
});
