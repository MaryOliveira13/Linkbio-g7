import { useEffect, useRef } from 'react';

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function useScrollScenes() {
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = main.current;
    const location = page?.querySelector<HTMLElement>('.location-panel');
    if (!page || !location) return;

    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    function update() {
      frame = 0;
      if (!location || preference.matches) return;
      const viewport = window.innerHeight;
      const panel = location.getBoundingClientRect();
      const travel = Math.min(165, viewport * .21);
      const arrival = Math.max(90, (viewport - panel.height) / 2);
      const entry = clampProgress((viewport - panel.top) / Math.max(1, viewport - arrival));
      location.style.setProperty('--panel-offset', (1 - entry) * travel + 'px');
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function syncPreference() {
      if (!page) return;
      page.toggleAttribute('data-scroll-scenes', !preference.matches);
      schedule();
    }

    syncPreference();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', syncPreference);
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    resize?.observe(page);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', syncPreference);
      resize?.disconnect();
    };
  }, []);

  return main;
}
