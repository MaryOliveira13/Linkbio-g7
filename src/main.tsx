import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, MessageCircle, Play, Video, X } from 'lucide-react';
import { config, whatsappLink } from './config';
import { Location } from './expanded-map';
import { useScrollScenes } from './scroll-scenes';
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
  const [selected, setSelected] = useState(0);
  const folders = useRef<Array<HTMLButtonElement | null>>([]);
  const gesture = useRef<{ id: number; x: number; y: number; axis: 'x' | 'y' | null } | null>(null);
  const suppressClick = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const active = current === null ? undefined : videos[current];

  function select(index: number) {
    player.current?.pause();
    setProgress(0);
    setCurrent(index);
    setSelected(index);
  }

  function navigate(offset: number) {
    if (current === null) return;
    const next = current + offset;
    if (next >= 0 && next < videos.length) select(next);
  }

  function moveSelection(offset: number) {
    setSelected(index => Math.max(0, Math.min(videos.length - 1, index + offset)));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    if (videos.length < 2) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (!start.axis && Math.max(Math.abs(x), Math.abs(y)) >= 9) {
      start.axis = Math.abs(x) > Math.abs(y) ? 'x' : 'y';
      suppressClick.current = true;
      if (start.axis === 'x') event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (start.axis !== 'x') return;
    event.currentTarget.dataset.dragging = 'true';
    const blocked = (selected === 0 && x > 0) || (selected === videos.length - 1 && x < 0);
    event.currentTarget.style.setProperty('--folder-drag', Math.max(-105, Math.min(105, x * (blocked ? .2 : .8))) + 'px');
  }

  function endDrag(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.max(Math.abs(x), Math.abs(y)) >= 9) suppressClick.current = true;
    gesture.current = null;
    delete event.currentTarget.dataset.dragging;
    event.currentTarget.style.removeProperty('--folder-drag');
    if (!cancelled && Math.abs(x) >= 42 && Math.abs(x) > Math.abs(y) && start.axis !== 'y') {
      moveSelection(x < 0 ? 1 : -1);
    }
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
        <div aria-roledescription="carrossel" aria-label="Depoimentos em vídeo" role="group">
          <div className="folders" onPointerDown={startDrag} onPointerMove={moveDrag}
            onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)}
            onLostPointerCapture={event => {
              if (event.target === event.currentTarget) endDrag(event, true);
            }}
            onPointerLeave={event => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) endDrag(event, true);
            }}
            onClickCapture={event => {
              if (event.detail === 0 || !suppressClick.current) return;
              suppressClick.current = false;
              event.preventDefault();
              event.stopPropagation();
            }}
            onKeyDown={event => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              const next = selected + (event.key === 'ArrowRight' ? 1 : -1);
              if (next < 0 || next >= videos.length) return;
              setSelected(next);
              requestAnimationFrame(() => folders.current[next]?.focus({ preventScroll: true }));
            }}>
            {videos.map((item, index) => {
              const distance = index - selected;
              return <button type="button" className="folder" key={item.video}
                ref={element => { folders.current[index] = element; }} data-open={openedFolder === index}
                data-centered={distance === 0} data-offstage={Math.abs(distance) > 2}
                aria-hidden={Math.abs(distance) > 2} tabIndex={distance === 0 ? 0 : -1} aria-haspopup="dialog"
                style={{ '--slot-distance': distance, '--slot-depth': Math.abs(distance) } as CSSProperties}
                onClick={() => {
                  setOpenedFolder(index);
                  select(index);
                  dialog.current?.showModal();
                }}>
                <span className="folder-back" aria-hidden="true" />
                <span className="folder-covers" aria-hidden="true">
                  {[-1, 0, 1].map(slot => <img key={slot} src={item.poster} alt="" draggable={false} loading="lazy"
                    style={{ '--slot': slot } as CSSProperties} />)}
                </span>
                <span className="folder-glass"><Play size={18} /> {item.title}</span>
              </button>;
            })}
          </div>
          {videos.length > 1 && <div className="story-controls carousel-controls">
            <button type="button" className="icon-button" disabled={selected === 0} onClick={() => moveSelection(-1)} aria-label="Pasta anterior"><ChevronLeft /></button>
            <span aria-live="polite">{selected + 1} de {videos.length}</span>
            <button type="button" className="icon-button" disabled={selected === videos.length - 1} onClick={() => moveSelection(1)} aria-label="Próxima pasta"><ChevronRight /></button>
          </div>}
        </div>
      )}
      <dialog ref={dialog} aria-label="Depoimento em vídeo" onClose={() => {
        player.current?.pause();
        setCurrent(null);
        setOpenedFolder(null);
        requestAnimationFrame(() => folders.current[selected]?.focus({ preventScroll: true }));
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
  const main = useScrollScenes();

  return (
    <>
      <a className="skip" href="#links">Ir para os links</a>
      <header className="topbar wrap" id="inicio">
        <a className="brand" href="#inicio" aria-label="G7 Scooters, início"><img src={config.logo} width="55" height="55" alt="" /></a>
        <nav aria-label="Navegação principal">
          <a href="#links">Links</a><a href="#localizacao">Localização</a>
        </nav>
      </header>
      <main ref={main}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-stage">
            <div className="arch">
              <div className="light" />
              <img className="hero-scooter" src={config.hero} width="317" height="480" alt="Scooter elétrica branca do catálogo G7, vista em três quartos" fetchPriority="high" />
            </div>
            <div className="hero-copy">
              <h1 id="hero-title"><span>G7</span> <em>Scooters</em></h1>
              <p>Scooters elétricas em Cedral, SP</p>
            </div>
          </div>
          <a className="scroll-link" href="#links" aria-label="Ver links da G7"><ChevronDown size={19} /></a>
        </section>
        <section id="links" className="links-section" aria-labelledby="links-title">
          <div className="wrap">
            <div className="links-heading">
              <h2 id="links-title">Explore a G7.</h2>
            </div>
            <div className="cards">
              {cards.map((card) => (
                <a className={`action-card ${card.style}`} key={card.style} href={card.url} target="_blank" rel="noreferrer">
                  <div className="card-copy"><span>{card.hint}</span><h3>{card.title}</h3></div>
                  <div className="card-art" aria-hidden="true">
                    <span className="card-platform" />
                    <img src={card.image} width="340" height="300" alt="" loading="lazy" />
                  </div>
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
