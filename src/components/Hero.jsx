import HmrIndicator from './HmrIndicator';

export default function Hero() {
  return (
    <div className="hero">
      <h1>Metro as a <span>Web Bundler</span></h1>
      <p>
        React Native's bundler, repurposed for the browser
        custom transformer, serializer, resolver, and HMR, wired by hand.
      </p>
      <HmrIndicator />
    </div>
  );
}
