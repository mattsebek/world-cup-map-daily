import { useEffect, useRef } from "react";
import * as d3 from "d3";
import WORLD from "../data/world.json";

function BackdropGlobe(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current; if(!canvas) return;
    const dpr=Math.min(2, window.devicePixelRatio||1), SIZE=900;
    canvas.width=SIZE*dpr; canvas.height=SIZE*dpr;
    const ctx=canvas.getContext("2d"); ctx.scale(dpr,dpr);
    const proj=d3.geoOrthographic().translate([SIZE/2,SIZE/2]).scale(SIZE/2-3).clipAngle(90);
    const path=d3.geoPath(proj,ctx);
    const grat=d3.geoGraticule().step([20,20])();
    const reduced=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // per-country shade variation — stable hash of feature id
    const shadeMap=new Map(WORLD.features.map(f=>{
      const h=[...(f.id||'')].reduce((a,c)=>a*31+c.charCodeAt(0),0)>>>0;
      const l=19+(h%9), s=48+((h>>4)%10);
      return [f.id,`hsl(225,${s}%,${l}%)`];
    }));
    let lon=210, last=performance.now(), raf;
    const draw=()=>{
      ctx.clearRect(0,0,SIZE,SIZE);
      const tilt=-10+Math.sin(lon*Math.PI/180*0.7)*4; // gentle tilt oscillation ±4°
      proj.rotate([lon,tilt,0]);
      ctx.beginPath(); path({type:"Sphere"});
      const g=ctx.createLinearGradient(0,0,0,SIZE);
      g.addColorStop(0,"#121c4a"); g.addColorStop(1,"#0a1030");
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); path(grat); ctx.strokeStyle="rgba(120,150,230,0.10)"; ctx.lineWidth=0.6; ctx.stroke();
      // draw each country individually with its shade
      WORLD.features.forEach(f=>{
        ctx.beginPath(); path(f);
        ctx.fillStyle=shadeMap.get(f.id)||"hsl(225,52%,22%)";
        ctx.fill();
        ctx.strokeStyle="rgba(0,240,216,0.22)"; ctx.lineWidth=0.5; ctx.stroke();
      });
      ctx.beginPath(); ctx.arc(SIZE/2,SIZE/2,SIZE/2-3,0,2*Math.PI);
      ctx.strokeStyle="rgba(0,240,216,0.28)"; ctx.lineWidth=1.4; ctx.stroke();
    };
    if(reduced){ draw(); return; }
    const tick=(now)=>{ const dt=now-last; last=now; lon+=dt*0.004; if(lon>=360)lon-=360; draw(); raf=requestAnimationFrame(tick); };
    raf=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <div className="homeglobe" aria-hidden="true"><canvas ref={ref} className="homeglobe-canvas"/></div>;
}

export default BackdropGlobe;
