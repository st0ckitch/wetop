/* global React, ReactDOM */
const { useState: useStateA, useEffect: useEffectA } = React;

function App() {
  const [tw, setTw] = useStateA(window.TWEAKS);

  useEffectA(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', tw.theme);
    html.setAttribute('data-accent', tw.accent);
    html.setAttribute('data-fontpair', tw.fontPair);
    html.setAttribute('data-motion', tw.motion);
  }, [tw]);

  window.useReveal();

  return (
    <>
      <Cursor />
      <Nav />
      <Hero variant={tw.heroVariant} />
      <About />
      <Timeline />
      <Cases />
      <Clients />
      <Skills />
      <TeachingBook />
      <Contact />
      <Tweaks state={tw} setState={setTw} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
