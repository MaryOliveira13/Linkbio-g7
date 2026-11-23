import { useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, MessageCircle, Play, Video, X, Zap } from 'lucide-react';
import { config, whatsappLink } from './config';
import { Location } from './expanded-map';
import './style.css';

const cards = [
  { title: 'Ver scooters elétricas', hint: 'Catálogo', image: '/media/scooter-card.webp', url: config.catalog, style: 'catalog' },
  { title: config.workshop ? 'Conserto e manutenção' : 'Consultar conserto', hint: 'Oficina', image: '/media/service.webp', url: config.workshop || whatsappLink(config.maintenanceMessage), style: 'service' },
  { title: 'Falar no WhatsApp', hint: 'Atendimento', image: '/media/chat.webp', url: whatsappLink(config.contactMessage), style: 'chat' },
];

function Testimonials() {
  const videos = config.testimonials;
  const [current, setCurrent] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [openedFolder, setOpenedFolder] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const origin = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
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
            <button className="folder" key={item.video} data-open={openedFolder === index} aria-haspopup="dialog" style={{ '--folder-index': index } as CSSProperties} onClick={(event) => {
              origin.current = event.currentTarget;
              setOpenedFolder(index);
              select(index);
              dialog.current?.showModal();
            }}>
              <span className="folder-back" aria-hidden="true" />
              <span className="folder-covers" aria-hidden="true">
                {[-1, 0, 1].map((slot) => <img
                  key={slot} src={item.poster} alt="" loading="lazy"
                  style={{ '--slot': slot } as CSSProperties}
                />)}
              </span>
              <span className="folder-glass"><Play size={18} /> {item.title}</span>
            </button>
          ))}
        </div>
      )}
      <dialog ref={dialog} aria-label="Depoimento em vídeo" onClose={() => {
        player.current?.pause();
        setCurrent(null);
        setOpenedFolder(null);
        origin.current?.focus({ preventScroll: true });
      }}>
        <div className="story-header">
          <h3>{active?.title}</h3>
          <button className="icon-button" onClick={() => dialog.current?.close()} aria-label="Fechar vídeo" autoFocus><X /></button>
        </div>
        {active && <div className="player" onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null; }}
          onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const touch = event.changedTouches[0];
            const delta = touch.clientX - touchStart.current.x;
            const vertical = touch.clientY - touchStart.current.y;
            touchStart.current = null;
            if (Math.abs(delta) > 65 && Math.abs(delta) > Math.abs(vertical)) navigate(delta < 0 ? 1 : -1);
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
          <div className="hero-light" aria-hidden="true" />
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
          <div className="curtain" aria-hidden="true" />
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
