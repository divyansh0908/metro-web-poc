import { useState } from 'react';
import { css } from './styles';
import { snippets } from './data/snippets';
import Hero from './components/Hero';
import Pipeline from './components/Pipeline';
import Stats from './components/Stats';
import FeatureCards from './components/FeatureCards';
import CodeViewer from './components/CodeViewer';

export default function App() {
  // Tracks which feature card is selected; defaults to the transformer
  const [selected, setSelected] = useState('transformer');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <Hero />

      <main className="main">
        <Pipeline />
        <Stats />

        <div className="section-title">Explore the POC: Click any card to see its code</div>
        <div className="explorer">
          <FeatureCards
            selected={selected}
            onSelect={setSelected}
            snippets={snippets}
          />
          <CodeViewer snippet={snippets[selected]} />
        </div>
      </main>

      <footer>
        Built with Metro 0.84 · React 19 · No webpack, no Vite, no Parcel
      </footer>
    </>
  );
}
