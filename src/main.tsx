import { useArrival } from './arrival';
import CardFanCarousel from './components/ui/card-fan-carousel';
import { createRoot } from 'react-dom/client';
import { config } from './config';
import { Location } from './expanded-map';
import { Opening } from './opening';
import { useScrollScenes } from './scroll-scenes';
import './style.css';

function Testimonials() {
  return <section id="depoimentos" className="testimonials" aria-labelledby="stories-title">
    <header className="testimonial-heading"><p className="kicker">DEPOIMENTOS G7</p><h2 id="stories-title">Mais que clientes.<br />Uma família.</h2></header>
    <CardFanCarousel />
  </section>;
}

function App() {
  useArrival();
  const main = useScrollScenes();

  return (
    <>
      <a className="skip" href="#localizacao">Ir para a localização</a>
      <main ref={main} id="inicio">
        <Opening />
        <nav className="bio-banners" aria-label="Catálogo, manutenção e comunidade">
          <a className="bio-banner" href={config.catalog} target="_blank" rel="noreferrer" aria-label="Ver catálogo de motos elétricas">
            <img src="/media/banner-catalog.webp" width="1080" height="500" alt="Nosso catálogo de moto elétrica" />
            <span className="bio-banner-button">Ver catálogo</span>
          </a>
          <a className="bio-banner" href="https://serviicog7.vercel.app/" target="_blank" rel="noreferrer" aria-label="Conhecer manutenção de motos elétricas">
            <img src="/media/banner-maintenance.webp" width="1080" height="500" alt="Manutenção de moto elétrica" />
            <span className="bio-banner-button">Manutenção</span>
          </a>
          <a className="bio-banner bio-community" href="https://chat.whatsapp.com/JiQhQVDkOgNJXKZm69jxPc" target="_blank" rel="noreferrer" aria-label="Entrar na comunidade G7 no WhatsApp">
            <img src="/media/banner-community.webp" width="1080" height="500" alt="Nossa comunidade no WhatsApp" />
            <span className="bio-banner-button">Nossa comunidade</span>
          </a>
        </nav>
        <Location />
        <section className="brand-strip" aria-label="G7: moto elétrica, qualidade, melhor preço e família">
          {[false, true].map(secondary => (
            <div className={secondary ? 'brand-ribbon brand-ribbon-secondary' : 'brand-ribbon'} key={String(secondary)} aria-hidden="true">
              <div className="brand-track">
                {[0, 1].map(group => <div className="brand-group" key={group}>
                  {['Moto elétrica', 'Qualidade', 'Melhor preço', 'Família', 'G7', 'Mobilidade', 'Liberdade'].map(word => <span key={word}>{word}<b>{secondary ? '·' : '/'}</b></span>)}
                </div>)}
              </div>
            </div>
          ))}
        </section>
        <Testimonials />
      </main>
      <footer className="footer"><a className="footer-logo" href="#inicio" aria-label="G7 Scooters — voltar ao início"><img src={config.logo} width="42" height="42" alt="G7 Scooters" /></a><span>Cedral, SP</span></footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

