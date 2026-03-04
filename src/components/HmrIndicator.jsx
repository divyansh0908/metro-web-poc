import { useState, useEffect } from 'react';

export default function HmrIndicator() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // The HMR WebSocket is set up in index.html before React boots.
    // It fires a custom event when the socket opens so we can reflect
    // the status inside the React tree without duplicating the socket.
    if (window.__metroHmrWs?.readyState === WebSocket.OPEN) {
      setConnected(true);
    }
    const onOpen = () => setConnected(true);
    window.addEventListener('metro-hmr-open', onOpen);
    return () => window.removeEventListener('metro-hmr-open', onOpen);
  }, []);

  return (
    <div className="hmr-pill">
      <div
        className="hmr-dot"
        style={connected ? {} : { background: '#8b949e', animationPlayState: 'paused' }}
      />
      {connected ? 'HMR connected' : 'HMR standby'}
    </div>
  );
}
