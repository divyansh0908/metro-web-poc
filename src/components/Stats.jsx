import { useState, useEffect } from 'react';

export default function Stats() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => setUptime(Math.floor((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { num: '16',      desc: 'modules in bundle' },
    { num: '5',       desc: 'pipeline stages' },
    { num: `${uptime}s`, desc: 'page uptime' },
    { num: '0',       desc: 'full reloads (HMR)' },
  ];

  return (
    <div className="counter-row">
      {stats.map(s => (
        <div className="counter-card" key={s.desc}>
          <div className="num">{s.num}</div>
          <div className="desc">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}
