import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { PALETTE } from "../lib/palette.js";
import { flagSrc, flagCode } from "../lib/flags.js";
import WORLD from "../data/world.json";
import CAPITALS from "../data/capitals.json";

const W=600, H=600, CTR=[300,300], BASE=292, MINZ=0.9, MAXZ=5.5;
const DEFAULT_ROT=[45,-12,0];

function Globe({ phase, answerISO, guessISO, onGuess, reduced }){
  const svgRef=useRef(null);
  const [rot,setRot]=useState(DEFAULT_ROT);
  const [zoom,setZoom]=useState(1);
  const [hover,setHover]=useState(null);

  const rotRef=useRef(rot), zoomRef=useRef(zoom), phaseRef=useRef(phase), onGuessRef=useRef(onGuess);
  useEffect(()=>{rotRef.current=rot;},[rot]);
  useEffect(()=>{zoomRef.current=zoom;},[zoom]);
  useEffect(()=>{phaseRef.current=phase;},[phase]);
  useEffect(()=>{onGuessRef.current=onGuess;},[onGuess]);

  const projection=useMemo(()=> d3.geoOrthographic().translate(CTR).clipAngle(90), []);
  projection.rotate(rot).scale(BASE*zoom);
  const pathGen=useMemo(()=> d3.geoPath(projection), [projection]);
  const graticule=useMemo(()=> d3.geoGraticule().step([20,20])(), []);
  const centroidById=useMemo(()=>{ const m={}; WORLD.features.forEach(f=>m[f.id]=d3.geoCentroid(f)); return m; }, []);
  const sortedCountries=useMemo(()=> WORLD.features.map(f=>({id:f.id,name:f.properties.name})).sort((a,b)=>a.name.localeCompare(b.name)), []);

  const capOf=useCallback((iso)=>{
    const c=CAPITALS[iso]; if(c) return {lat:c.lat,lng:c.lng,name:c.capital};
    const ce=centroidById[iso]; return ce?{lat:ce[1],lng:ce[0],name:"—"}:null;
  },[centroidById]);

  const rafRef=useRef(null), timerRef=useRef(null);
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
    const toLonLat=(sx,sy)=>{
      const r=node.getBoundingClientRect();
      const x=(sx-r.left)*(W/r.width), y=(sy-r.top)*(H/r.height);
      const dx=x-CTR[0], dy=y-CTR[1], rad=BASE*zoomRef.current;
      if(dx*dx+dy*dy > rad*rad) return null;
      return projection.invert([x,y]);
    };
    const drag=d3.drag()
      .on("start",()=>{ moved=0; cancelAnimationFrame(rafRef.current); })
      .on("drag",(e)=>{ moved+=Math.abs(e.dx)+Math.abs(e.dy);
        const k=0.26/Math.sqrt(zoomRef.current);
        setRot(p=>[p[0]+e.dx*k, Math.max(-89,Math.min(89,p[1]-e.dy*k)), 0]);
      })
      .on("end",(e)=>{
        if(moved>5 || phaseRef.current!=="guessing") return;
        const ll=toLonLat(e.sourceEvent.clientX, e.sourceEvent.clientY);
        if(!ll){ document.dispatchEvent(new CustomEvent("wcmd-outside")); return; }
        const hit=WORLD.features.find(f=> d3.geoContains(f, ll));
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

  const onDouble=(e)=>{
    const node=svgRef.current, r=node.getBoundingClientRect();
    const x=(e.clientX-r.left)*(W/r.width), y=(e.clientY-r.top)*(H/r.height);
    const dx=x-CTR[0], dy=y-CTR[1], rad=BASE*zoomRef.current;
    if(dx*dx+dy*dy<=rad*rad){
      const ll=projection.invert([x,y]);
      if(ll){ animateTo([-ll[0],-ll[1],0], Math.min(MAXZ, zoomRef.current*1.7)); return; }
    }
    setZoom(z=>Math.min(MAXZ,z*1.4));
  };

  useEffect(()=>{ if(phase==="guessing") animateTo(rotRef.current, 1); /* eslint-disable-next-line */ },[answerISO]);

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
      const z = sep>1.7?1.0 : sep>0.8?1.3 : 1.7;
      animateTo(frameOn(ca[0],ca[1],z), z);                   // stage 2: answer flag centered & visible
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

  const fillFor=(id)=>{
    if(reveal && id===answerISO) return "url(#correctFill)";
    if(reveal && id===guessISO && id!==answerISO) return "rgba(255,59,73,0.6)";
    if(!reveal && id===hover) return "rgba(0,240,216,0.32)";
    return PALETTE.land;
  };

  return (
    <div className="mapwrap">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="globe" onDoubleClick={onDouble}
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
        <button aria-label="Reset globe" onClick={()=>animateTo(DEFAULT_ROT,1)}>⟲</button>
      </div>

      {phase==="guessing" && <div className="hint">Drag to spin · double-click to zoom · tap a country</div>}

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
  const parts=useMemo(()=> Array.from({length:34},(_,i)=>{
    const ang=Math.random()*Math.PI*2, dist=26+Math.random()*46;
    return { tx:Math.cos(ang)*dist, ty:Math.sin(ang)*dist-8, rot:Math.random()*720-360,
      d:(Math.random()*0.12).toFixed(3), w:3+Math.random()*3, h:5+Math.random()*5, c:cols[i%cols.length] };
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
