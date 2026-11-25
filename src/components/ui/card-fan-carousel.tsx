import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import cards from '../../testimonial-videos.json';

export default function CardFanCarousel() {
  const [index,setIndex]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [muted,setMuted]=useState(false);
  const [error,setError]=useState('');
  const video=useRef<HTMLVideoElement>(null);
  const start=useRef<{x:number;y:number}|null>(null);
  const root=useRef<HTMLDivElement>(null);
  const suppressClick=useRef(0);
  const select=(n:number)=>{video.current?.pause();setPlaying(false);setError('');setIndex((n+cards.length)%cards.length);};
  useEffect(()=>{if(video.current){video.current.volume=1;video.current.muted=muted;}},[muted,index]);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)video.current?.pause();},{threshold:0.15});if(root.current)observer.observe(root.current);return()=>observer.disconnect();},[]);
  const toggle=()=>{const el=video.current;if(!el)return;if(el.paused){setError('');if(el.error)el.load();void el.play().catch((err: DOMException)=>{if(err.name!=='AbortError'&&video.current===el&&el.isConnected)setError('Toque novamente para reproduzir o vídeo.');});}else el.pause();};
  return <div className="video-fan" ref={root} aria-roledescription="carrossel" aria-label="Vídeos dos clientes G7">
    <div className="video-fan-stage" onPointerDown={e=>{
      if(e.button!==0||(e.target as HTMLElement).closest('.fan-sound-toggle,input'))return;
      suppressClick.current=0;
      start.current={x:e.clientX,y:e.clientY};
      if(e.pointerType==='mouse')(e.target as HTMLElement).setPointerCapture(e.pointerId);
    }} onPointerUp={e=>{
      if(!start.current)return;
      const x=e.clientX-start.current.x,y=e.clientY-start.current.y;
      start.current=null;
      if(Math.abs(x)>40&&Math.abs(x)>Math.abs(y)){
        suppressClick.current=Date.now()+450;
        select(index+(x<0?1:-1));
      }
    }} onPointerCancel={()=>{start.current=null;}} onClickCapture={e=>{
      if(Date.now()<suppressClick.current){e.preventDefault();e.stopPropagation();suppressClick.current=0;}
    }}>

      {cards.map((card,i)=>{let offset=(i-index+cards.length)%cards.length;if(offset>cards.length/2)offset-=cards.length;const visible=Math.abs(offset)<=1,active=offset===0;return <div key={card.video} className="video-fan-card" data-active={active} aria-hidden={!visible} style={{'--slot':Math.max(-2,Math.min(2,offset)),'--distance':Math.min(2,Math.abs(offset)),zIndex:10-Math.abs(offset),opacity:visible?1:0,pointerEvents:visible?'auto':'none'} as CSSProperties}>
        {active?<><video key={card.video} ref={video} src={card.video} poster={card.poster} playsInline preload="metadata" muted={muted} role="button" tabIndex={0} aria-label={playing?'Pausar vídeo':'Reproduzir vídeo'} onClick={toggle} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}}} onPlay={()=>{setPlaying(true);setError('');}} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>setError('Não foi possível carregar este vídeo.')} />
          <button className="fan-sound-toggle" onClick={()=>setMuted(!muted)} aria-label={muted?'Ativar som':'Silenciar'} aria-pressed={muted}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button>
        </>:<button className="fan-select" tabIndex={visible?0:-1} onClick={()=>select(i)} aria-label={'Ver '+card.title}><img src={card.poster} alt={card.title} loading="lazy" draggable="false" /></button>}
      </div>;})}
    </div>
    {error&&<p role="alert">{error}</p>}
    <div className="fan-navigation">
      <button onClick={()=>select(index-1)} aria-label="Vídeo anterior"><ChevronLeft/></button>
      <div className="fan-dots">{cards.map((c,i)=><button key={c.video} onClick={()=>select(i)} aria-label={'Ir para vídeo '+(i+1)} aria-current={i===index?'true':undefined}><span /></button>)}</div>
      <button onClick={()=>select(index+1)} aria-label="Próximo vídeo"><ChevronRight/></button>
    </div>
    <a className="fan-instagram" href="https://www.instagram.com/g7scooters/" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>Ver Instagram</a>
  </div>;
}
