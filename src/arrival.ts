import { useEffect } from 'react';

export function useArrival() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(document.querySelectorAll<HTMLElement>([
      '.hero-media', '.hero-brand > *', '.bio-banner',
      '.g7-location__heading > *', '.g7-location__brand', '.g7-location__details', '.g7-location__button',
      '.brand-strip', '.testimonial-heading > *', '.video-fan-stage', '.fan-navigation', '.fan-instagram', '.footer > *'
    ].join(',')));
    if (!('IntersectionObserver' in window) || preference.matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('arrival-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    elements.forEach(el => { el.classList.add('arrival'); observer.observe(el); });
    const showAll = () => { if(preference.matches) elements.forEach(el=>el.classList.add('arrival-visible')); };
    const onFocus = (event: FocusEvent) => {
      (event.target as HTMLElement)?.closest('.arrival')?.classList.add('arrival-visible');
    };
    document.addEventListener('focusin', onFocus);
    preference.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', showAll);
      document.removeEventListener('focusin', onFocus);
      elements.forEach(el=>el.classList.remove('arrival','arrival-visible'));
    };
  }, []);
}
