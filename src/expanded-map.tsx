import { useRef, useState, type PointerEvent } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { Clock3, Expand, MapPin, Minimize2, Navigation } from 'lucide-react';
import { config } from './config';

export function Location() {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const board = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [7, -7]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-9, 9]), { stiffness: 300, damping: 30 });
  const { store } = config;

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== 'mouse' || interactive || !board.current) return;
    const bounds = board.current.getBoundingClientRect();
    pointerX.set(2 * (event.clientX - bounds.left) / bounds.width - 1);
    pointerY.set(2 * (event.clientY - bounds.top) / bounds.height - 1);
  }

  return (
    <section className="location" id="localizacao" aria-labelledby="location-title">
      <div className="location-light" aria-hidden="true" />
      <div className="location-layout wrap">
        <div className="location-copy">
          <p className="kicker"><MapPin size={15} /> Nossa loja</p>
          <h2 id="location-title">Visite a G7<br /> em <em>Cedral.</em></h2>
          <address>{store.street}<br />{store.city} · CEP {store.postalCode}</address>
          <p className="hours"><Clock3 size={17} /> <span>{store.weekdays}<br />{store.saturday}</span></p>
          <a className="directions" href={store.directions} target="_blank" rel="noreferrer"><Navigation size={17} /> Como chegar</a>
        </div>
        <div className="location-panel">
          <div className="map-shell" data-expanded={expanded}>
            <div className="map-top">
              <span><MapPin size={15} /> Cedral, SP</span>
              <button type="button" aria-expanded={expanded} aria-controls="map-scene" onClick={() => {
                if (expanded) {
                  setDetails(false);
                  setInteractive(false);
                  resetPointer();
                }
                setExpanded(!expanded);
              }}>{expanded ? <><Minimize2 size={15} /> Recolher</> : <><Expand size={15} /> Expandir mapa</>}</button>
            </div>
            <div className="map-scene" id="map-scene" ref={board} onPointerMove={move} onPointerLeave={resetPointer}>
              {interactive ? (
                <iframe title="G7 Scooters no Google Maps" src={store.embed} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <m.div className="map-plane" style={reduce ? undefined : { rotateX, rotateY }}>
                  <div className="map-surface" aria-hidden="true">
                    <img src={store.facade || store.mapImage} width="760" height="390" loading="lazy" draggable="false" alt="" />
                  </div>
                  <div className="map-shade" aria-hidden="true" />
                  <button className="map-pin" aria-label="Detalhes da unidade G7 Scooters" aria-expanded={details} aria-controls="store-details" onClick={() => setDetails(!details)}>
                    <img src={config.logo} width="44" height="44" alt="" />
                    <span aria-hidden="true">G7 Scooters</span>
                  </button>
                  <div className="store-details" id="store-details" hidden={!details}>
                    <strong>{config.name}</strong>
                    <span>{store.street}</span>
                    <span>{store.city}</span>
                  </div>
                </m.div>
              )}
              {!interactive && !store.facade && <a className="attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>}
            </div>
            {expanded && <div className="map-actions">
              <a href={store.listing} target="_blank" rel="noreferrer">Ver loja no Google Maps</a>
              <button type="button" aria-pressed={interactive} onClick={() => {
                resetPointer();
                setDetails(false);
                setInteractive(!interactive);
              }}>{interactive ? 'Voltar à vista da loja' : 'Abrir mapa interativo'}</button>
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
