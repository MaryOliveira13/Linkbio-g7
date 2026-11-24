import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { config } from './config';

export function Opening() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || preference.matches) return;

    let finished = false;
    function showVideo() {
      if (!finished) setPlaying(true);
    }
    function showFinalFrame() {
      finished = true;
      setPlaying(false);
    }
    function onPreferenceChange(event: MediaQueryListEvent) {
      if (!event.matches) return;
      element?.pause();
      showFinalFrame();
    }

    element.addEventListener('playing', showVideo);
    element.addEventListener('ended', showFinalFrame);
    element.addEventListener('error', showFinalFrame);
    preference.addEventListener('change', onPreferenceChange);
    element.muted = true;
    element.src = config.opening.video;
    void element.play().catch(() => {
      if (!finished) showFinalFrame();
    });

    return () => {
      finished = true;
      element.pause();
      element.removeEventListener('playing', showVideo);
      element.removeEventListener('ended', showFinalFrame);
      element.removeEventListener('error', showFinalFrame);
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-frame">
        <img className="hero-media" src={config.opening.finalFrame} width="720" height="1280" alt="" fetchPriority="high" />
        <video ref={video} className="hero-media hero-video" data-playing={playing} muted playsInline aria-hidden="true" />
        <h1 className="hero-logo" id="hero-title"><img src={config.logo} width="300" height="300" alt={config.name} /></h1>
      </div>
      <p>Scooters elétricas em Cedral, SP</p>
      <a className="scroll-link" href="#links" aria-label="Ver links da G7"><ChevronDown size={19} /></a>
    </section>
  );
}
