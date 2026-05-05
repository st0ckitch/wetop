/* ============================================================
   offer.js — vanilla port that mirrors components.jsx behaviours
   so offer.html lives inside the portfolio's design system.

   - Cursor (matches React <Cursor/>)
   - Live Tbilisi clock (matches <Clock/>)
   - Reveal on scroll (matches useReveal)
   - CountUp on intersection (matches <CountUp/>)
   - Mobile nav toggle (matches Nav open state)
   - Three.js particle layer (subtle, behind hero-grid)
   - Chart.js doughnut for the $1500 / $500 split
   All colors are read from CSS vars so theme/accent tweaks
   on Portfolio.html cascade if the user matches them here.
   ============================================================ */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  function readVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // ============================================================
  // CURSOR (mirrors components.jsx Cursor)
  // ============================================================
  function initCursor() {
    if (isTouch) return;
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    const pos  = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
      pos.x = e.clientX; pos.y = e.clientY;
    });
    window.addEventListener('mousedown', () => ring.classList.add('hover'));
    window.addEventListener('mouseup',   () => ring.classList.remove('hover'));

    const hoverables = [
      'a','button','.t-row','.case','.team-card','.feature-card',
      '.feature-link','.brand-tile','.btn','.pill','.skill','.kv'
    ].join(',');
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) {
        dot.classList.add('hover');
        ring.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    });

    function tick() {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      dot.style.transform  = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ============================================================
  // CLOCK (mirrors <Clock/>)
  // ============================================================
  function initClock() {
    const el = document.getElementById('navClock');
    if (!el) return;
    const fmt = () => {
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tbilisi', hour12: false };
      el.textContent = new Intl.DateTimeFormat('en-GB', opts).format(new Date()) + ' TBS';
    };
    fmt();
    setInterval(fmt, 1000);
  }

  // ============================================================
  // NAV TOGGLE (mirrors Nav open/close)
  // ============================================================
  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const list = document.getElementById('navList');
    if (!nav || !toggle || !list) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    list.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // REVEAL on scroll
  // ============================================================
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  // ============================================================
  // COUNT-UP
  // ============================================================
  function initCountUp() {
    const els = document.querySelectorAll('.count');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach((el) => { el.textContent = el.dataset.target; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const dur = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
  }

  // ============================================================
  // CHART.JS — doughnut, accent-driven
  // ============================================================
  function initBudgetChart() {
    const canvas = document.getElementById('budgetChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const accent = readVar('--accent', '#cc4499');
    const accentSoft = readVar('--accent-soft', 'rgba(204,68,153,.15)');
    const trackBg = readVar('--bg-2', '#0B0D12');

    let started = false;
    const draw = () => {
      if (started) return;
      started = true;
      const ctx = canvas.getContext('2d');
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Messages & Engagement', 'Awareness'],
          datasets: [{
            data: [75, 25],
            backgroundColor: [accent, accentSoft],
            borderColor: trackBg,
            borderWidth: 4,
            hoverOffset: 8,
          }],
        },
        options: {
          cutout: '72%',
          responsive: true,
          maintainAspectRatio: false,
          animation: { animateRotate: !reduceMotion, duration: reduceMotion ? 0 : 1400, easing: 'easeOutCubic' },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: trackBg,
              borderColor: accent, borderWidth: 1,
              titleFont: { family: 'JetBrains Mono', size: 11 },
              bodyFont: { family: 'Space Grotesk', size: 13 },
              padding: 12,
              callbacks: { label: (c) => `${c.label}: ${c.parsed}%` },
            },
          },
        },
      });
    };

    if (!('IntersectionObserver' in window)) return draw();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { draw(); io.unobserve(e.target); } });
    }, { threshold: 0.3 });
    io.observe(canvas);
  }

  // ============================================================
  // THREE.JS particle layer (subtle, behind hero content)
  // ============================================================
  function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    let accentColor;
    try {
      accentColor = new THREE.Color(readVar('--accent', '#cc4499'));
    } catch (_) {
      accentColor = new THREE.Color('#cc4499');
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 600 : 1100;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const dim       = accentColor.clone().multiplyScalar(0.45);

    for (let i = 0; i < COUNT; i++) {
      const r = 80 + Math.pow(Math.random(), 2) * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      positions[i*3+2] = r * Math.cos(phi);
      const c = Math.random() < 0.7 ? accentColor : dim;
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5, vertexColors: true, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const orbitGeo = new THREE.TorusGeometry(180, 0.4, 8, 96);
    const orbitMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.16 });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI / 2.6;
    scene.add(orbit);

    const target = { x: 0, y: 0 };
    const mouse  = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 60;
      target.y = (e.clientY / window.innerHeight - 0.5) * 60;
    }, { passive: true });

    function size() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', size);
    size();

    let raf = 0; let running = true;
    function tick(now) {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      const t = (now || 0) * 0.00018;
      points.rotation.y = t;
      points.rotation.x = Math.sin(t * 1.5) * 0.08;
      orbit.rotation.z += reduceMotion ? 0 : 0.0014;
      camera.position.x += ( mouse.x - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    if (!reduceMotion) raf = requestAnimationFrame(tick);
    else renderer.render(scene, camera);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!reduceMotion) { running = true; raf = requestAnimationFrame(tick); }
    });
  }

  // ============================================================
  // BOOT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initClock();
    initNav();
    initReveal();
    initCountUp();
    initBudgetChart();
    initThreeHero();
  });
})();
