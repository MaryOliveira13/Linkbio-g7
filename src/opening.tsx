import { config } from './config';

export function Opening() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-frame">
        <img className="hero-media" src={config.opening.image} srcSet="/media/g7-opening-store-small.webp 640w, /media/g7-opening-store-light.webp 1080w" sizes="(max-width: 500px) 100vw, 500px" width="1080" height="800" alt="Scooters em frente à loja G7 Scooters" fetchPriority="high" />
      </div>
      <div className="hero-brand">
        <img className="hero-logo" src="/media/g7-hero-logo.webp" width="300" height="297" alt={config.name} />
        <h1 id="hero-title">GRUPO 7</h1>
        <p>A família que mais cresce!</p>
      </div>
    </section>
  );
}
