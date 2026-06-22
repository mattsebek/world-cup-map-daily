import { useState } from "react";
import { resultLabel, bandEmoji, fmt, todayStr } from "../lib/util.js";
import { flagSrc } from "../lib/flags.js";
import DistanceCounter from "./DistanceCounter.jsx";
import PARTICIPANTS from "../data/participants.json";
import WORLD from "../data/world.json";

function Results({guesses, questions, profile, reduced, onRegister, onLeaderboard, onHome}){
  const total=guesses.reduce((s,g)=>s+g.distance,0);
  const exact=guesses.filter(g=>g.isExact).length;
  const best=guesses.reduce((b,g)=> g.distance<b.distance?g:b, guesses[0]);
  const worstG=guesses.reduce((b,g)=> g.distance>b.distance?g:b, guesses[0]);
  const nameOf=iso=> questions.find(q=>q.answer===iso)?.reveal.title || iso;
  const shareText=`World Cup Map Daily\n${todayStr()}\nScore: ${fmt(total)} mi\n${guesses.map(g=>bandEmoji(g.distance)).join(" ")}\nworldcupmapda.ily`;
  const [copied,setCopied]=useState(false);
  const share=async()=>{
    if(navigator.share){ try{ await navigator.share({title:"World Cup Map Daily", text:shareText}); return; }catch{} }
    try{ await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(()=>setCopied(false),1500); }catch{}
  };
  return (
    <div className="results">
      <div className="rhero">
        <span className="reye">Today’s score</span>
        <div className="rbig"><DistanceCounter value={total} reduced={reduced} dur={1100}/> <i>mi</i></div>
        <span className="rsub">Lower is better</span>
      </div>
      <div className="chips">
        <span className="chip green">{exact} exact</span>
        <span className="chip">Best · {nameOf(best.answer)}</span>
        <span className="chip">Biggest miss · {nameOf(worstG.answer)}</span>
        <span className="chip turq">Rank · #{182+Math.round(total/40)} today</span>
      </div>
      <div className="restable">
        <div className="rthead"><span>#</span><span>Answer</span><span>Your guess</span><span className="ra">Distance</span></div>
        {guesses.map((g,i)=>{
          const gn=PARTICIPANTS[g.guess]?.name || WORLD.features.find(f=>f.id===g.guess)?.properties.name || g.guess;
          const af=flagSrc(g.answer);
          return <div className="rtrow" key={i}>
            <span>{i+1}</span>
            <span className="tans">{af && <img className="tflag" src={af} alt=""/>}<span className="tname">{nameOf(g.answer)}</span></span>
            <span>{gn}</span>
            <span className="ra"><i style={{color:resultLabel(g.distance).c}}>{bandEmoji(g.distance)}</i> {fmt(g.distance)} mi</span>
          </div>;
        })}
      </div>
      <div className="sharebar">
        <button className="ghost" onClick={share}>{copied?"Copied ✓":"Share result"}</button>
        <button className="ghost" onClick={onLeaderboard}>View leaderboard</button>
      </div>
      {!profile
        ? <div className="regcta"><p>Save your score and climb the daily leaderboard.</p>
            <button className="primary" onClick={()=>onRegister({total,exact,worst:worstG.distance})}>Save score · Join leaderboard</button></div>
        : <div className="regcta done"><p>Saved as <b>{profile.displayName}</b>. You’re on today’s board.</p>
            <button className="primary" onClick={onLeaderboard}>See your rank</button></div>}
      <button className="textlink" onClick={onHome}>Back to home</button>
    </div>
  );
}

export default Results;
