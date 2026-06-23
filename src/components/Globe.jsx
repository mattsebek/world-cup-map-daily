import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { PALETTE } from "../lib/palette.js";
import { flagSrc, flagCode } from "../lib/flags.js";
import WORLD from "../data/world-geo.js";
import CAPITALS from "../data/capitals.json";

const W=600, H=600, CTR=[300,300], BASE=292, MINZ=0.9, MAXZ=5.5;
const DEFAULT_ROT=[100,-38,0];
const defaultZoom=()=> window.innerWidth>860 ? 1.1 : 1.33;

function Globe({ phase, answerISO, guessISO, onGuess, reduced }){
  const svgRef=useRef(null);
  const [rot,setRot]=useState(DEFAULT_ROT);
  const [zoom,setZoom]=useState(defaultZoom);
  const [hover,setHover]=useState(null);

  const rotRef=useRef(rot), zoomRef=useRef(zoom), phaseRef=useRef(phase), onGuessRef=useRef(onGuess);
  useEffect(()=>{rotRef.current=rot;},[rot]);
  useEffect(()=>{zoomRef.current=zoom;},[zoom]);
  useEffect(()=>{phaseRef.current=phase;},[phase]);
  useEffect(()=>{onGuessRef.current=onGuess;},[onGuess]);

  const projection=useMemo(()=> d3.geoOrthographic().translate(CTR).clipAngle(90).precision(0.2), []);
  projection.rotate(rot).scale(BASE*zoom);
  const pathGen=useMemo(()=> d3.geoPath(projection), [projection]);
  const graticule=useMemo(()=> d3.geoGraticule().step([20,20])(), []);
  const centroidById=useMemo(()=>{ const m={}; WORLD.features.forEach(f=>m[f.id]=d3.geoCentroid(f)); return m; }, []);
  const sortedCountries=useMemo(()=> WORLD.features.map(f=>({id:f.id,name:f.properties.name})).sort((a,b)=>a.name.localeCompare(b.name)), []);

  const capOf=useCallback((iso)=>{
    const c=CAPITALS[iso]; if(c) return {lat:c.lat,lng:c.lng,name:c.capital};
    const ce=centroidById[iso]; return ce?{lat:ce[1],lng:ce[0],name:"—"}:null;
  },[centroidById]);

  const rafRef=useRef(null), timerRef=useRef(null), spinRef=useRef(null), draggingRef=useRef(false), hasInteractedRef=useRef(false);
  const animateTo=useCallback((tr, tz)=>{
    cancelAnimationFrame(rafRef.current);
    const sr=rotRef.current.slice(), sz=zoomRef.current;
    let d0=tr[0]-sr[0]; while(d0>180)d0-=360; while(d0<-180)d0+=360;
    const d1=tr[1]-sr[1], dz=tz-sz, dur=reduced?0:720, t0=performance.now();
    const tick=(now)=>{
      const p=dur?Math.min(1,(now-t0)/dur):1, e=1-Math.pow(1-p,3);
      setRot([sr[0]+d0*e, sr[1]+d1*e, 0]); setZoom(sz+dz*e);
      if(p<1) rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
  },[reduced]);

  // center [lon,lat] but lifted above middle so the flag (drawn above the point) stays clear of the bottom sheet
  const frameOn=useCallback((lon,lat,z)=>{
    const LIFT=58; const dLat=(LIFT/(BASE*z))*(180/Math.PI);
    return [-lon, -(lat - dLat), 0];
  },[]);

  useEffect(()=>{
    const node=svgRef.current;
    const sel=d3.select(node);
    let moved=0;
    // Handles both square and portrait containers with xMidYMid slice rendering
    const screenToViewBox=(sx,sy,r)=>{
      const scale=Math.max(r.width/W, r.height/H);
      const ox=(r.width-W*scale)/2, oy=(r.height-H*scale)/2;
      return [(sx-r.left-ox)/scale, (sy-r.top-oy)/scale];
    };
    const toLonLat=(sx,sy)=>{
      const r=node.getBoundingClientRect();
      const [x,y]=screenToViewBox(sx,sy,r);
      const dx=x-CTR[0], dy=y-CTR[1];
      const visRad=Math.min(BASE*zoomRef.current, 298);
      if(dx*dx+dy*dy > visRad*visRad) return null;
      return projection.invert([x,y]);
    };
    const drag=d3.drag()
      .on("start",()=>{ moved=0; draggingRef.current=true; hasInteractedRef.current=true; cancelAnimationFrame(rafRef.current); })
      .on("drag",(e)=>{ moved+=Math.abs(e.dx)+Math.abs(e.dy);
        const k=0.26/Math.sqrt(zoomRef.current);
        setRot(p=>[p[0]+e.dx*k, Math.max(-89,Math.min(89,p[1]-e.dy*k)), 0]);
      })
      .on("end",(e)=>{
        draggingRef.current=false;
        if(moved>5 || phaseRef.current!=="guessing") return;
        // Use raw client coords + screenToViewBox for correct xMidYMid slice hit detection on mobile
        const src=e.sourceEvent;
        const cx=src.changedTouches?src.changedTouches[0].clientX:src.clientX;
        const cy=src.changedTouches?src.changedTouches[0].clientY:src.clientY;
        const r=node.getBoundingClientRect();
        const [vx,vy]=screenToViewBox(cx,cy,r);
        const dx=vx-CTR[0], dy=vy-CTR[1];
        const visRad=BASE*zoomRef.current;
        if(dx*dx+dy*dy > visRad*visRad){ document.dispatchEvent(new CustomEvent("wcmd-outside")); return; }
        const ll=projection.invert([vx,vy]);
        if(!ll){ document.dispatchEvent(new CustomEvent("wcmd-outside")); return; }
        const hit=WORLD.features.find(f=> f.id!=='ATA' && d3.geoContains(f, ll));
        if(hit) onGuessRef.current(hit.id);
        else document.dispatchEvent(new CustomEvent("wcmd-outside"));
      });
    sel.call(drag);
    const wheel=(e)=>{ e.preventDefault();
      const f=e.deltaY<0?1.12:1/1.12;
      setZoom(z=>Math.max(MINZ,Math.min(MAXZ,z*f)));
    };
    node.addEventListener("wheel", wheel, {passive:false});
    return ()=>{ sel.on(".drag",null); node.removeEventListener("wheel",wheel); cancelAnimationFrame(rafRef.current); clearTimeout(timerRef.current); };
  },[projection]);

  // Soft auto-rotation during guessing phase
  useEffect(()=>{
    if(phase!=="guessing"){ cancelAnimationFrame(spinRef.current); return; }
    let last=performance.now();
    const tick=(now)=>{
      const dt=now-last; last=now;
      if(!draggingRef.current && !hasInteractedRef.current) setRot(r=>[r[0]-dt*0.004, r[1], r[2]]);
      spinRef.current=requestAnimationFrame(tick);
    };
    spinRef.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(spinRef.current);
  },[phase]);

  const onDouble=(e)=>{
    const node=svgRef.current, r=node.getBoundingClientRect();
    const scale=Math.max(r.width/W,r.height/H);
    const ox=(r.width-W*scale)/2, oy=(r.height-H*scale)/2;
    const x=(e.clientX-r.left-ox)/scale, y=(e.clientY-r.top-oy)/scale;
    const dx=x-CTR[0], dy=y-CTR[1], rad=BASE*zoomRef.current;
    if(dx*dx+dy*dy<=rad*rad){
      const ll=projection.invert([x,y]);
      if(ll){ animateTo([-ll[0],-ll[1],0], Math.min(MAXZ, zoomRef.current*1.7)); return; }
    }
    setZoom(z=>Math.min(MAXZ,z*1.4));
  };

  useEffect(()=>{ if(phase==="guessing"){ hasInteractedRef.current=false; animateTo(DEFAULT_ROT, defaultZoom()); } /* eslint-disable-next-line */ },[answerISO]);

  useEffect(()=>{
    if(phase!=="revealed" || !guessISO) return;
    clearTimeout(timerRef.current);
    const cg=centroidById[guessISO];
    if(cg) animateTo(frameOn(cg[0],cg[1],2.4), 2.4);          // stage 1: guess flag centered & visible
    if(guessISO===answerISO) return;                          // exact — stay on it
    const ca=centroidById[answerISO];
    const gc=capOf(guessISO), ac=capOf(answerISO);
    const run=()=>{
      const sep=d3.geoDistance([gc.lng,gc.lat],[ac.lng,ac.lat]);
      // zoom out to show both endpoints simultaneously
      const mid=d3.geoInterpolate([gc.lng,gc.lat],[ac.lng,ac.lat])(0.5);
      const halfSep=sep/2;
      // fit endpoints at ~62% of globe radius; clamp to sane range
      const targetZ=Math.min(MAXZ, Math.max(MINZ, 0.62/Math.sin(Math.max(halfSep,0.01))));
      animateTo(frameOn(mid[0],mid[1],targetZ), targetZ);
    };
    if(reduced) run(); else timerRef.current=setTimeout(run, 900);
    return ()=>clearTimeout(timerRef.current);
    /* eslint-disable-next-line */
  },[phase,guessISO]);

  const reveal=phase==="revealed";
  const exactReveal=reveal && guessISO===answerISO;
  const center=[-rot[0],-rot[1]];
  const visible=(lng,lat)=> d3.geoDistance([lng,lat],center) < Math.PI/2-0.015;

  const aCap=reveal?capOf(answerISO):null, gCap=(reveal&&guessISO)?capOf(guessISO):null;
  const aPt=aCap&&visible(aCap.lng,aCap.lat)?projection([aCap.lng,aCap.lat]):null;
  const gPt=gCap&&guessISO!==answerISO&&visible(gCap.lng,gCap.lat)?projection([gCap.lng,gCap.lat]):null;
  const arcD=(reveal&&aCap&&gCap&&guessISO!==answerISO)
    ? pathGen({type:"LineString", coordinates:d3.range(0,1.0001,1/80).map(t=>d3.geoInterpolate([gCap.lng,gCap.lat],[aCap.lng,aCap.lat])(t))})
    : null;

  const landShades=useMemo(()=>{
    const m={};
    WORLD.features.forEach(f=>{
      const h=[...(f.id||'')].reduce((a,c)=>a*31+c.charCodeAt(0),0)>>>0;
      const l=19+(h%9);       // lightness 19–27%
      const s=48+((h>>4)%10); // saturation 48–57%
      m[f.id]=`hsl(225,${s}%,${l}%)`;
    });
    return m;
  },[]);

  const fillFor=(id)=>{
    if(reveal && id===answerISO) return "url(#correctFill)";
    if(reveal && id===guessISO && id!==answerISO) return "rgba(255,59,73,0.6)";
    if(!reveal && id===hover) return "rgba(0,240,216,0.32)";
    return landShades[id]||PALETTE.land;
  };

  return (
    <div className="mapwrap">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="globe" onDoubleClick={onDouble}
           preserveAspectRatio="xMidYMid slice" shapeRendering="geometricPrecision"
           role="img" aria-label="Interactive 3D globe. Drag to rotate, double-click to zoom, tap a country to guess.">
        <defs>
          <radialGradient id="ocean" cx="38%" cy="32%" r="78%">
            <stop offset="0%" stopColor="#10204f"/><stop offset="62%" stopColor={PALETTE.ocean0}/><stop offset="100%" stopColor={PALETTE.ocean1}/>
          </radialGradient>
          <radialGradient id="correctFill" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#5BFFC9"/><stop offset="100%" stopColor={PALETTE.green}/>
          </radialGradient>
          <radialGradient id="atmos" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor="rgba(0,240,216,0)"/><stop offset="97%" stopColor="rgba(0,240,216,0.18)"/><stop offset="100%" stopColor="rgba(0,240,216,0)"/>
          </radialGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="flagclip"><rect x="-15" y="-30" width="30" height="21" rx="3.5"/></clipPath>
          <clipPath id="flagclipBig"><rect x="-24" y="-17" width="48" height="34" rx="5"/></clipPath>
          <filter id="flagshadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="1.6" stdDeviation="1.6" floodColor="#000" floodOpacity="0.55"/>
          </filter>
        </defs>

        <circle cx={CTR[0]} cy={CTR[1]} r={BASE*zoom+8} fill="url(#atmos)"/>
        <path d={pathGen({type:"Sphere"})} fill="url(#ocean)" stroke="rgba(0,240,216,0.25)" strokeWidth="1"/>
        <path d={pathGen(graticule)} fill="none" stroke="rgba(120,150,230,0.13)" strokeWidth="0.5"/>
        {WORLD.features.map(f=>{
          const d=pathGen(f); if(!d) return null;
          const hot = reveal && (f.id===answerISO||f.id===guessISO);
          return <path key={f.id} d={d} fill={fillFor(f.id)}
            stroke={hot?"#fff":PALETTE.landLine} strokeWidth={hot?1.2:0.5}
            filter={reveal&&f.id===answerISO?"url(#glow)":undefined}
            className={phase==="guessing"?"cty live":"cty"}
            onMouseEnter={()=> phase==="guessing" && setHover(f.id)}
            onMouseLeave={()=> setHover(h=>h===f.id?null:h)} />;
        })}
        {arcD && <path d={arcD} fill="none" stroke={PALETTE.coral} strokeWidth="2.4" strokeLinecap="round" filter="url(#glow)" opacity="0.95"/>}
        {!exactReveal && gPt && <FlagMarker x={gPt[0]} y={gPt[1]} iso={guessISO} accent={PALETTE.red} reduced={reduced} delay={0}/>}
        {!exactReveal && aPt && <FlagMarker x={aPt[0]} y={aPt[1]} iso={answerISO} accent={PALETTE.green} reduced={reduced} delay={reduced?0:150}/>}
        {exactReveal && aPt && <Confetti x={aPt[0]} y={aPt[1]} iso={answerISO} reduced={reduced}/>}
      </svg>

      <div className="mapctrl">
        <button aria-label="Zoom in" onClick={()=>animateTo(rotRef.current, Math.min(MAXZ,zoomRef.current*1.5))}>+</button>
        <button aria-label="Zoom out" onClick={()=>animateTo(rotRef.current, Math.max(MINZ,zoomRef.current/1.5))}>−</button>
        <button aria-label="Reset globe" onClick={()=>animateTo(DEFAULT_ROT,3.0)}>⟲</button>
      </div>

      <label className="selrow">
        <span>Prefer a list?</span>
        <select disabled={phase!=="guessing"} value=""
                onChange={e=>{ if(e.target.value && phase==="guessing") onGuess(e.target.value); }}>
          <option value="">Select a country…</option>
          {sortedCountries.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
    </div>
  );
}

function FlagMarker({x,y,iso,accent,reduced,delay}){
  const [in_,setIn]=useState(reduced);
  useEffect(()=>{ if(reduced){setIn(true);return;} const id=setTimeout(()=>setIn(true),delay); return ()=>clearTimeout(id); },[reduced,delay]);
  const src=flagSrc(iso), code=flagCode(iso);
  return (
    <g filter="url(#flagshadow)" style={{opacity:in_?1:0,
        transform:`translate(${x}px,${y}px) translateY(${in_?0:-8}px)`,
        transition:reduced?"none":"transform .42s cubic-bezier(.2,1.25,.4,1), opacity .3s"}}>
      <path d="M -4.5,-9.5 L 0,0 L 4.5,-9.5 Z" fill={accent}/>
      <rect x="-15" y="-30" width="30" height="21" rx="3.5" fill="#0a1030"/>
      <text x="0" y="-16.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#9AA3C7" fontFamily="'Space Grotesk',sans-serif">{code}</text>
      {src && <image href={src} x="-15" y="-30" width="30" height="21" clipPath="url(#flagclip)" preserveAspectRatio="xMidYMid slice"/>}
      <rect x="-15" y="-30" width="30" height="21" rx="3.5" fill="none" stroke={accent} strokeWidth="1.6"/>
    </g>
  );
}

function Confetti({x,y,iso,reduced}){
  const src=flagSrc(iso), code=flagCode(iso);
  const cols=[PALETTE.turq,PALETTE.lime,PALETTE.coral,PALETTE.violet,PALETTE.green,PALETTE.red,PALETTE.blue];
  const parts=useMemo(()=> Array.from({length:90},(_,i)=>{
    const ang=Math.random()*Math.PI*2, dist=50+Math.random()*130;
    return { tx:Math.cos(ang)*dist, ty:Math.sin(ang)*dist-12, rot:Math.random()*900-450,
      d:(Math.random()*0.18).toFixed(3), w:4+Math.random()*4, h:6+Math.random()*8, c:cols[i%cols.length] };
  }),[]);
  return (
    <g style={{transform:`translate(${x}px,${y}px)`}}>
      {!reduced && parts.map((p,i)=>(
        <rect key={i} className="confetto" x={-p.w/2} y={-p.h/2} width={p.w} height={p.h} rx="1" fill={p.c}
          style={{["--tx"]:p.tx+"px",["--ty"]:p.ty+"px",["--rot"]:p.rot+"deg",["--d"]:p.d+"s"}}/>
      ))}
      <g className={reduced?"":"flagpop"} filter="url(#flagshadow)">
        <rect x="-24" y="-17" width="48" height="34" rx="5" fill="#0a1030"/>
        <text x="0" y="6" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9AA3C7" fontFamily="'Space Grotesk',sans-serif">{code}</text>
        {src && <image href={src} x="-24" y="-17" width="48" height="34" clipPath="url(#flagclipBig)" preserveAspectRatio="xMidYMid slice"/>}
        <rect x="-24" y="-17" width="48" height="34" rx="5" fill="none" stroke={PALETTE.green} strokeWidth="2"/>
      </g>
    </g>
  );
}

export default Globe;
