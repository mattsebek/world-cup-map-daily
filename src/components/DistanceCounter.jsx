import { useState, useEffect } from "react";
import { fmt } from "../lib/util.js";

function DistanceCounter({value, reduced, dur=850}){
  const [n,setN]=useState(reduced?value:0);
  useEffect(()=>{
    if(reduced){ setN(value); return; }
    let raf, start;
    const step=(ts)=>{ if(!start)start=ts; const p=Math.min(1,(ts-start)/dur);
      setN(Math.round(value*(1-Math.pow(1-p,3)))); if(p<1) raf=requestAnimationFrame(step); };
    raf=requestAnimationFrame(step); return ()=>cancelAnimationFrame(raf);
  },[value,reduced,dur]);
  return <>{fmt(n)}</>;
}

export default DistanceCounter;
