import { MapPin } from 'lucide-react';
import './location.css';

export function Location() {
  return (
    <section className="g7-location" id="localizacao" aria-labelledby="location-title">
      <iframe className="g7-location__map" title="Localização da G7 Scooters em Cedral" src="https://maps.google.com/maps?q=G7%20Scooters%2C%20Av.%20Cel.%20Silv%C3%A9rio%20da%20Cunha%20Lacerda%2C%20Cedral%20SP&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />
      <div className="g7-location__veil" aria-hidden="true" />
      <div className="g7-location__heading">
        <span className="g7-location__eyebrow">Venha conhecer pessoalmente!</span>
        <h2 id="location-title">Nossa localização</h2>
      </div>
      <article className="g7-location__card">
        <div className="g7-location__brand">
          <img src="/media/loja-google-maps.webp" alt="Fachada real da loja G7 Scooters em Cedral" loading="lazy" />
          <span>LOJA FÍSICA</span>
        </div>
        <div className="g7-location__details">
          <div className="g7-location__pin" aria-hidden="true"><MapPin /></div>
          <div>
            <h3>G7 Scooters</h3>
            <address>Av. Cel. Silvério da Cunha Lacerda<br />Centro · Cedral – SP<br />CEP 15895-001</address>
          </div>
        </div>
        <a className="g7-location__button" href="https://maps.app.goo.gl/aEezDwxBjuwUP6Cy5" target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
        <a className="g7-location__button g7-location__review" href="https://search.google.com/local/writereview?placeid=ChIJV2BQ5ttJvJQRE8EyJ8Xy3VA" target="_blank" rel="noopener noreferrer">Nos avalie no Google</a>
      </article>
    </section>
  );
}
