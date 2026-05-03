/* global React */
const { useState: useStateT, useEffect: useEffectT } = React;

// ============================================================
// TWEAKS PANEL
// ============================================================
function Tweaks({ state, setState }) {
  const [open, setOpen] = useStateT(true);
  const [available, setAvailable] = useStateT(false);

  useEffectT(() => {
    const onMsg = e => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setAvailable(true);
      if (d.type === '__deactivate_edit_mode') setAvailable(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  function update(key, val) {
    const next = { ...state, [key]: val };
    setState(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  }

  if (!available) return null;

  const themes = [['dark','Dark'], ['light','Light']];
  const accents = [['lime','sw-lime'], ['cyan','sw-cyan'], ['magenta','sw-magenta'], ['amber','sw-amber'], ['white','sw-white']];
  const fonts = [['grotesk-mono','Grotesk × Mono'], ['archivo-mono','Archivo × Mono'], ['serif-mono','Serif × Mono']];
  const heros = [['constellation','Constellation'], ['particles','Particles 3D'], ['minimal','Minimal']];
  const motions = [['full','Full'], ['reduced','Reduced'], ['off','Off']];

  return (
    <div className="tweaks-panel">
      <h4>Tweaks
        <button onClick={() => setOpen(o => !o)}
                style={{marginLeft:'auto', color:'var(--ink-dim)', fontSize:10}}>
          {open ? '−' : '+'}
        </button>
      </h4>
      {open && <>
        <div className="tweak-group">
          <div className="tweak-label">Theme</div>
          <div className="tweak-pills">
            {themes.map(([v, l]) => (
              <button key={v} className={`pill ${state.theme === v ? 'active' : ''}`} onClick={() => update('theme', v)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="tweak-group">
          <div className="tweak-label">Accent</div>
          <div className="swatches">
            {accents.map(([v, cls]) => (
              <button key={v} className={`swatch ${cls} ${state.accent === v ? 'active' : ''}`} onClick={() => update('accent', v)} />
            ))}
          </div>
        </div>

        <div className="tweak-group">
          <div className="tweak-label">Font pair</div>
          <div className="tweak-pills">
            {fonts.map(([v, l]) => (
              <button key={v} className={`pill ${state.fontPair === v ? 'active' : ''}`} onClick={() => update('fontPair', v)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="tweak-group">
          <div className="tweak-label">Hero variant</div>
          <div className="tweak-pills">
            {heros.map(([v, l]) => (
              <button key={v} className={`pill ${state.heroVariant === v ? 'active' : ''}`} onClick={() => update('heroVariant', v)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="tweak-group" style={{marginBottom:0}}>
          <div className="tweak-label">Motion</div>
          <div className="tweak-pills">
            {motions.map(([v, l]) => (
              <button key={v} className={`pill ${state.motion === v ? 'active' : ''}`} onClick={() => update('motion', v)}>{l}</button>
            ))}
          </div>
        </div>
      </>}
    </div>
  );
}

Object.assign(window, { Tweaks });
