/* global React */
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC, useMemo: useMemoC } = React;

// ============================================================
// CURSOR
// ============================================================
function Cursor() {
  // Skip entirely on touch / coarse-pointer devices
  const isTouch = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouch) return null;

  const dotRef = useRefC(null);
  const ringRef = useRefC(null);
  const pos = useRefC({ x: -100, y: -100 });
  const ring = useRefC({ x: -100, y: -100 });

  useEffectC(() => {
    const onMove = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onDown = () => { ringRef.current?.classList.add('hover'); };
    const onUp = () => { ringRef.current?.classList.remove('hover'); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // hover detection
    const hoverables = ['a', 'button', '.t-row', '.node-group', '.skill', '.case', '.pill', '.swatch', '.client-chip', '.feature-link'];
    const selector = hoverables.join(',');
    const onOver = e => {
      if (e.target.closest(selector)) {
        dotRef.current?.classList.add('hover');
        ringRef.current?.classList.add('hover');
      }
    };
    const onOut = e => {
      if (e.target.closest(selector)) {
        dotRef.current?.classList.remove('hover');
        ringRef.current?.classList.remove('hover');
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    let raf;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ============================================================
// LIVE CLOCK
// ============================================================
function Clock() {
  const [t, setT] = useStateC('');
  useEffectC(() => {
    const fmt = () => {
      const d = new Date();
      // Tbilisi is UTC+4
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tbilisi', hour12: false };
      setT(new Intl.DateTimeFormat('en-GB', opts).format(d) + ' TBS');
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="clock">{t}</span>;
}

// ============================================================
// REVEAL on scroll
// ============================================================
function useReveal() {
  useEffectC(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

// ============================================================
// COUNT-UP
// ============================================================
function CountUp({ to, duration = 1400, suffix = '', prefix = '' }) {
  const [val, setVal] = useStateC(0);
  const ref = useRefC(null);
  useEffectC(() => {
    let started = false;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = now => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(to * eased));
            if (p < 1) requestAnimationFrame(tick);
            else setVal(to);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

// ============================================================
// CAREER CONSTELLATION (hero data-viz)
// ============================================================
function Constellation() {
  const W = 1200, H = 600;
  const CX = W / 2, CY = H / 2;
  const items = window.CAREER;
  const [active, setActive] = useStateC(null);

  // arrange nodes radially, ordered by year (latest top, then around)
  const sorted = useMemoC(() => [...items].sort((a, b) => b.year - a.year), [items]);

  const nodes = sorted.map((c, i) => {
    const angle = (i / sorted.length) * Math.PI * 2 - Math.PI / 2;
    // stagger radii so orbits look organic
    const ring = i % 3;
    const r = 180 + ring * 55;
    return {
      ...c,
      x: CX + Math.cos(angle) * r,
      y: CY + Math.sin(angle) * r * 0.75,
      r: 8 + c.weight * 18,
      angle, ring,
    };
  });

  // unique orbits
  const rings = [180, 235, 290];

  return (
    <div className="constellation">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* orbits (ellipses to match the 0.75 y-scale) */}
        {rings.map((r, i) => (
          <ellipse key={i} className="orbit" cx={CX} cy={CY} rx={r} ry={r * 0.75} />
        ))}

        {/* connector lines from center to each node */}
        {nodes.map(n => (
          <line key={`l-${n.id}`} className="link-line" x1={CX} y1={CY} x2={n.x} y2={n.y}
                strokeOpacity={active && active !== n.id ? 0.1 : 0.3} />
        ))}

        {/* hub halo */}
        <circle cx={CX} cy={CY} r="120" fill="url(#hubGrad)" opacity="0.5" />

        {/* hub core */}
        <g>
          <circle cx={CX} cy={CY} r="40" fill="var(--bg-2)" stroke="var(--accent)" strokeWidth="1" filter="url(#softGlow)" />
          <circle cx={CX} cy={CY} r="6" className="hub-core" />
          <text x={CX} y={CY - 58} textAnchor="middle" className="node-year" fill="var(--accent)">ARTYOM</text>
          <text x={CX} y={CY + 68} textAnchor="middle" className="node-year">8+ YRS · TBILISI</text>
        </g>

        {/* nodes */}
        {nodes.map(n => {
          const isActive = active === n.id;
          const labelY = n.y > CY ? n.y + n.r + 18 : n.y - n.r - 10;
          const yearY = n.y > CY ? n.y + n.r + 32 : n.y - n.r - 24;
          const anchor = Math.abs(n.x - CX) < 40 ? 'middle' : (n.x > CX ? 'start' : 'end');
          const labelX = anchor === 'middle' ? n.x : (n.x > CX ? n.x + n.r + 6 : n.x - n.r - 6);
          return (
            <g key={n.id}
               className={`node-group ${isActive ? 'active' : ''}`}
               onMouseEnter={() => setActive(n.id)}
               onMouseLeave={() => setActive(null)}>
              <circle className="node-circle" cx={n.x} cy={n.y} r={n.r + 12} fill="transparent" />
              <circle className="node-circle" cx={n.x} cy={n.y} r={n.r} />
              <text x={anchor === 'middle' ? n.x : labelX} y={labelY}
                    textAnchor={anchor} className="node-label">{n.org}</text>
              <text x={anchor === 'middle' ? n.x : labelX} y={yearY}
                    textAnchor={anchor} className="node-year">
                {Math.floor(n.year)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// PARTICLES (three.js hero variant)
// ============================================================
function Particles() {
  const canvasRef = useRefC(null);

  useEffectC(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window.THREE === 'undefined') return;

    const THREE = window.THREE;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Read accent from CSS so it tracks the tweaks panel
    const accentRaw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    let accentColor;
    try {
      accentColor = new THREE.Color(accentRaw || '#ffffff');
    } catch (_) {
      accentColor = new THREE.Color('#ffffff');
    }

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 600 : 1200;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const dim       = accentColor.clone().multiplyScalar(0.45);

    for (let i = 0; i < COUNT; i++) {
      const r = 80 + Math.pow(Math.random(), 2) * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() < 0.7 ? accentColor : dim;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const orbitGeo = new THREE.TorusGeometry(180, 0.4, 8, 96);
    const orbitMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.18 });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI / 2.6;
    scene.add(orbit);

    const target = { x: 0, y: 0 };
    const mouse  = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 60;
      target.y = (e.clientY / window.innerHeight - 0.5) * 60;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    function size() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', size);
    size();

    let raf = 0;
    let running = true;
    function tick(now) {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      const t = (now || 0) * 0.00018;
      points.rotation.y = t;
      points.rotation.x = Math.sin(t * 1.5) * 0.08;
      orbit.rotation.z += reduceMotion ? 0 : 0.0014;
      camera.position.x += (mouse.x - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    if (!reduceMotion) raf = requestAnimationFrame(tick);
    else renderer.render(scene, camera);

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!reduceMotion) { running = true; raf = requestAnimationFrame(tick); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', onVis);
      geometry.dispose();
      material.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />;
}

Object.assign(window, { Cursor, Clock, useReveal, CountUp, Constellation, Particles });
