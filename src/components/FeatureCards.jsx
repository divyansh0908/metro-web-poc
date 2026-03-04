import { FEATURE_ORDER } from '../data/snippets';

const META = {
  transformer: { icon: '⚙️',  title: 'Custom Babel Transformer' },
  serializer:  { icon: '📦', title: 'Custom Serializer' },
  hmr:         { icon: '♨️',  title: 'Browser HMR' },
  resolver:    { icon: '🔍', title: 'Custom Resolver' },
  parser:      { icon: '🐍', title: 'Hermes / Babel Parser' },
  cache:       { icon: '💾', title: 'Transform Cache' },
};

export default function FeatureCards({ selected, onSelect, snippets }) {
  return (
    <div className="cards">
      {FEATURE_ORDER.map(id => {
        const { icon, title } = META[id];
        const { description } = snippets[id];
        const isActive = selected === id;

        return (
          <div
            key={id}
            className={`card${isActive ? ' active' : ''}`}
            onClick={() => onSelect(id)}
          >
            <div className="card-header">
              <div className="card-icon">{icon}</div>
              <h3>{title}</h3>
            </div>
            <p>{description}</p>
          </div>
        );
      })}
    </div>
  );
}
