import { useState, useEffect } from "react";
import * as d3 from "d3";
import { haversineMiles } from "../lib/util.js";
import CAPITALS from "../data/capitals.json";
import WORLD from "../data/world.json";
import Globe from "./Globe.jsx";
import ClueCard from "./ClueCard.jsx";
import RevealPanel from "./RevealPanel.jsx";

function Game({questions, onFinish, reduced}){
  const [qi,setQi]=useState(0);
  const [phase,setPhase]=useState("guessing");
  const [guesses,setGuesses]=useState([]);
  const [toast,setToast]=useState(null);
  const q=questions[qi];
  const miniTotal=guesses.reduce((s,g)=>s+g.distance,0);

  useEffect(()=>{
    const h=()=>{ setToast("Tap a country to guess."); setTimeout(()=>setToast(null),1400); };
    document.addEventListener("wcmd-outside",h); return ()=>document.removeEventListener("wcmd-outside",h);
  },[]);

  const onGuess=(iso)=>{
    if(phase!=="guessing") return;
    const a=CAPITALS[q.answer], gc=CAPITALS[iso];
    let dist;
    if(iso===q.answer) dist=0;
    else if(a&&gc) dist=haversineMiles(a.lat,a.lng,gc.lat,gc.lng);
    else { const cf=WORLD.features.find(f=>f.id===iso); const c=cf?d3.geoCentroid(cf):null; dist=(a&&c)?haversineMiles(a.lat,a.lng,c[1],c[0]):9999; }
    setGuesses(g=>[...g,{answer:q.answer,guess:iso,distance:dist,isExact:iso===q.answer}]);
    setPhase("revealed");
  };
  const next=()=>{ if(qi<questions.length-1){ setQi(qi+1); setPhase("guessing"); } else onFinish(guesses); };
  const cur=guesses[qi];

  return (
    <div className="game">
      <div className="progress">{questions.map((_,i)=><span key={i} className={"pdot"+(i<qi?" done":"")+(i===qi?" now":"")}/>)}</div>
      <div className="gamegrid">
        <div className="leftpane">
          <ClueCard q={q} miniTotal={miniTotal}/>
        </div>
        <div className="rightpane">
          <Globe phase={phase} answerISO={q.answer} guessISO={cur?.guess} onGuess={onGuess} reduced={reduced}/>
        </div>
      </div>
      {phase==="revealed" && cur &&
        <div className="revealsheet">
          <div className="revealsheet-inner">
            <div className="sheetgrab"/>
            <RevealPanel q={q} guessISO={cur.guess} distance={cur.distance} onNext={next} last={qi===questions.length-1} reduced={reduced}/>
          </div>
        </div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Game;
