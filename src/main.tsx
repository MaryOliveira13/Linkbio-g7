import { useRef, useState, type PointerEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, MessageCircle, Navigation, Play, Video, X, Zap } from 'lucide-react';
import { config, whatsappLink } from './config';
import './style.css';

const cards = [
  { title: 'Ver scooters elétricas', hint: 'Catálogo', image: '/media/scooter-card.webp', url: config.catalog, style: 'catalog' },
  { title: config.workshop ? 'Conserto e manutenção' : 'Consultar conserto', hint: 'Oficina', image: '/media/service.webp', url: config.workshop || whatsappLink(config.maintenanceMessage), style: 'service' },
  { title: 'Falar no WhatsApp', hint: 'Atendimento', image: '/media/chat.webp', url: whatsappLink(config.contactMessage), style: 'chat' },
];

function Location() {
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [tilt, setTilt] = useState(0);
  const drag = useRef<{ x: number; tilt: number } | null>(null);
  const { store } = config;

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const delta = (event.clientX - drag.current.x) / 12;
    setTilt(Math.max(-13, Math.min(13, drag.current.tilt + delta)));
  }

  return (
    <section className="location" id="localizacao" aria-labelledby="location-title">
      <div className="location-layout wrap">
        <div className="location-copy">
          <p className="kicker"><MapPin size={15} /> Nossa loja</p>
          <h2 id="location-title">Visite a G7<br /> em <em>Cedral.</em></h2>
          <address>{store.street}<br />{store.city} · CEP {store.postalCode}</address>
          <p className="hours"><Clock3 size={17} /> <span>{store.weekdays}<br />{store.saturday}</span></p>
          <a className="directions" href={store.directions} target="_blank" rel="noreferrer"><Navigation size={17} /> Como chegar</a>
        </div>
        <div className="map-shell">
          <div className="map-top"><span><MapPin size={15} /> Cedral, SP</span><button type="button" aria-expanded={showMap} aria-controls="map-scene" onClick={() => setShowMap(!showMap)}>{showMap ? 'Voltar à vista da loja' : 'Abrir mapa interativo'}</button></div>
          <div className="map-scene" id="map-scene">
            {showMap ? <iframe title="G7 Scooters no Google Maps" src={store.embed} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /> :
              <>
                <div className="map-surface" aria-hidden="true"
                  style={{ transform: `perspective(700px) rotateY(${tilt}deg) scale(1.025)` }}
                  onPointerDown={(event) => {
                    if (event.button !== 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                    drag.current = { x: event.clientX, tilt };
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={move}
                  onLostPointerCapture={() => { drag.current = null; }}>
                  <img src={store.facade || store.mapImage} width="760" height="390" loading="lazy" draggable="false" alt="" />
                </div>
                <button className="map-pin" aria-label="Detalhes da unidade G7 Scooters" aria-expanded={showDetails} aria-controls="store-details" onClick={() => setShowDetails(!showDetails)}>
                  <img src={config.logo} width="44" height="44" alt="" />
                </button>
                <div className="store-details" id="store-details" hidden={!showDetails}>
                  <strong>{config.name}</strong>
                  <span>{store.street}</span>
                  <span>{store.city}</span>
                </div>
                {!store.facade && <a className="attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>}
              </>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const videos = config.testimonials;
  const [current, setCurrent] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const origin = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const active = current === null ? undefined : videos[current];

  function select(index: number) {
    player.current?.pause();
    setProgress(0);
    setCurrent(index);
  }

  function navigate(offset: number) {
    if (current === null) return;
    const next = current + offset;
    if (next >= 0 && next < videos.length) select(next);
  }

  return (
    <section id="depoimentos" className="testimonials wrap" aria-labelledby="stories-title">
      <p className="kicker"><Video size={15} /> Depoimentos</p>
      <h2 id="stories-title">Clientes G7.</h2>
      {videos.length === 0 ? (
        <div className="empty-story">
          <span className="empty-icon"><Video size={23} /></span>
          <div><h3>Depoimentos em vídeo</h3><p>Ainda não há vídeos disponíveis por aqui.</p></div>
        </div>
      ) : (
        <div className="folders">
          {videos.map((item, index) => (
            <button className="folder" key={item.video} onClick={(event) => {
              origin.current = event.currentTarget;
              select(index);
              dialog.current?.showModal();
            }}>
              <img src={item.poster} alt="" loading="lazy" />
              <span><Play size={18} /> {item.title}</span>
            </button>
          ))}
        </div>
      )}
      <dialog ref={dialog} aria-label="Depoimento em vídeo" onClose={() => {
        player.current?.pause();
        setCurrent(null);
        origin.current?.focus();
      }}>
        <div className="story-header">
          <h3>{active?.title}</h3>
          <button className="icon-button" onClick={() => dialog.current?.close()} aria-label="Fechar vídeo" autoFocus><X /></button>
        </div>
        {active && <div className="player" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStart.current;
            touchStart.current = null;
            if (Math.abs(delta) > 65) navigate(delta < 0 ? 1 : -1);
          }}>
          <video key={active.video} ref={player} src={active.video} poster={active.poster} controls autoPlay playsInline
            onTimeUpdate={(event) => {
              const { currentTime, duration } = event.currentTarget;
              setProgress(Number.isFinite(duration) && duration > 0 ? currentTime / duration : 0);
            }}>
            {active.captions && <track kind="captions" srcLang="pt-BR" label="Português" src={active.captions} />}
          </video>
          <progress max={1} value={progress} aria-label="Progresso do vídeo" />
        </div>}
        {videos.length > 1 && current !== null && <div className="story-controls">
          <button className="icon-button" disabled={current === 0} onClick={() => navigate(-1)} aria-label="Vídeo anterior"><ChevronLeft /></button>
          <span>{current + 1} de {videos.length}</span>
          <button className="icon-button" disabled={current === videos.length - 1} onClick={() => navigate(1)} aria-label="Próximo vídeo"><ChevronRight /></button>
        </div>}
      </dialog>
    </section>
  );
}

function App() {
  return (
    <>
      <a className="skip" href="#links">Ir para os links</a>
      <header className="topbar wrap" id="inicio">
        <a className="brand" href="#inicio" aria-label="G7 Scooters, início"><img src={config.logo} width="55" height="55" alt="" /></a>
        <nav aria-label="Navegação principal">
          <a href="#links">Links</a><a href="#localizacao">Localização</a>
        </nav>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-stage">
            <div className="arch">
              <div className="light" />
              <img className="hero-scooter" src={config.hero} width="317" height="480" alt="Scooter elétrica branca do catálogo G7, vista em três quartos" fetchPriority="high" />
            </div>
            <div className="hero-copy">
              <h1 id="hero-title">G7 <em>Scooters</em></h1>
              <p>Scooters elétricas em Cedral, SP</p>
            </div>
          </div>
          <a className="scroll-link" href="#links" aria-label="Ver links da G7"><ChevronDown size={19} /></a>
        </section>
        <section id="links" className="links-section" aria-labelledby="links-title">
          <div className="wrap">
            <div className="links-heading">
              <p className="kicker"><Zap size={15} /> Links da G7</p>
              <h2 id="links-title">Escolha seu caminho.</h2>
            </div>
            <div className="cards">
              {cards.map((card) => (
                <a className={`action-card ${card.style}`} key={card.style} href={card.url} target="_blank" rel="noreferrer">
                  <div className="card-copy"><span>{card.hint}</span><h3>{card.title}</h3></div>
                  <img src={card.image} width="340" height="300" alt="" loading="lazy" />
                  <span className="card-arrow" aria-hidden="true">{card.style === 'chat' ? <MessageCircle size={16} /> : <ArrowUpRight size={17} />}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <Location />
        <div className="brand-strip" aria-hidden="true">
          <div className="brand-track">
            {[0, 1].map((group) => <div className="brand-group" key={group}>
              {Array.from({ length: 12 }, (_, index) => <img key={index} src={config.logo} alt="" width="48" height="48" loading="lazy" />)}
            </div>)}
          </div>
        </div>
        <Testimonials />
      </main>
      <footer className="footer wrap"><img src={config.logo} width="42" height="42" alt="G7 Scooters" /><span>Cedral, SP</span><a href="#inicio">Voltar ao início</a></footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
