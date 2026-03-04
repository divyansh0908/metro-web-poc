import React from 'react';

const STEPS = [
  { icon: '📄', label: 'Source',      sub: '.jsx / .tsx' },
  { icon: '🔍', label: 'Resolver',    sub: 'resolveRequest' },
  { icon: '⚙️',  label: 'Transformer', sub: 'Babel + Hermes' },
  { icon: '📦', label: 'Serializer',  sub: 'baseJSBundle' },
  { icon: '🌐', label: 'Browser',     sub: 'eval() HMR' },
];

export default function Pipeline() {
  return (
    <div>
      <div className="section-title">Transform Pipeline</div>
      <div className="pipeline">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className="pipeline-step">
              <div className="icon">{step.icon}</div>
              <div className="label">{step.label}</div>
              <div className="sub">{step.sub}</div>
            </div>
            {i < STEPS.length - 1 && <div className="pipeline-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
