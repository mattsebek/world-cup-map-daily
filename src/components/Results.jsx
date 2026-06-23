import { useState } from "react";
import { bandEmoji, fmt, fmtTime, agentRank, todayStr } from "../lib/util.js";
import { flagSrc } from "../lib/flags.js";
import DistanceCounter from "./DistanceCounter.jsx";
import PARTICIPANTS from "../data/participants.json";
import WORLD from "../data/world.json";

function Results({guesses, questions, totalTime, profile, reduced, onRegister, onLeaderboard, onHome}){
  const totalDist   = guesses.reduce((s,g) => s + g.distance, 0);
  const totalPenalty= guesses.reduce((s,g) => s + g.timePenalty, 0);
  const finalScore  = guesses.reduce((s,g) => s + g.caseScore, 0);
  const exact       = guesses.filter(g => g.isExact).length;
  const rank        = agentRank(finalScore);
  const nameOf = iso => questions.find(q=>q.answer===iso)?.reveal.title || iso;
  const guessNameOf = iso => PARTICIPANTS[iso]?.name || WORLD.features.find(f=>f.id===iso)?.properties.name || iso;

  const shareText = [
    "World Cup Map Daily — Mission Complete",
    todayStr(),
    "",
    `Final Score: ${fmt(finalScore)}`,
    `Distance: ${fmt(totalDist)} mi  ·  Time: ${fmtTime(totalTime)}`,
    `Cases: ${guesses.map(g=>bandEmoji(g.distance)).join(" ")}`,
    `Rank: ${rank}`,
    "",
    "Lower is better · worldcupmapda.ily",
  ].join("\n");

  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (navigator.share) { try { await navigator.share({title:"World Cup Map Daily", text:shareText}); return; } catch {} }
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(()=>setCopied(false),1500); } catch {}
  };

  return (
    <div className="results">
      <div className="rhero">
        <span className="reye">Mission Complete</span>
        <div className="rbig"><DistanceCounter value={finalScore} reduced={reduced} dur={1100}/></div>
        <span className="rsub">Final Mission Score</span>
      </div>

      <div className="chips">
        <span className="chip green">{exact} correct {exact===1?"selection":"selections"}</span>
        <span className="chip">Time · {fmtTime(totalTime)}</span>
        <span className="chip">Time Penalty · +{fmt(totalPenalty)}</span>
      </div>

      <div className="score-breakdown">
        <div className="sb-row">
          <span>Distance Off Trail</span><span>{fmt(totalDist)} mi</span>
        </div>
        <div className="sb-row">
          <span>Completion Time</span><span>{fmtTime(totalTime)}</span>
        </div>
        <div className="sb-row sb-penalty">
          <span>Time Penalty</span><span>+{fmt(totalPenalty)}</span>
        </div>
        <div className="sb-row sb-final">
          <span>Final Mission Score</span><span>{fmt(finalScore)}</span>
        </div>
      </div>

      <div className="restable">
        <div className="rthead">
          <span>#</span><span>Target</span><span className="ca">Your Selection</span>
          <span className="ra hideS">Dist</span><span className="ra hideS">Time</span><span className="ra">Score</span>
        </div>
        {guesses.map((g,i)=>{
          const af = flagSrc(g.answer);
          return (
            <div className="rtrow" key={i}>
              <span>{i+1}</span>
              <span className="tans">
                {af && <img className="tflag" src={af} alt=""/>}
                <span className="tname">{nameOf(g.answer)}</span>
              </span>
              <span className="ca">{g.isExact ? <span style={{color:"var(--green)"}}>✓ Exact</span> : guessNameOf(g.guess)}</span>
              <span className="ra hideS">{fmt(g.distance)} mi</span>
              <span className="ra hideS">{fmtTime(g.caseTime)}</span>
              <span className="ra">{fmt(g.caseScore)}</span>
            </div>
          );
        })}
      </div>

      <div className="sharebar">
        <button className="ghost" onClick={share}>{copied ? "Copied ✓" : "Share result"}</button>
        <button className="ghost" onClick={onLeaderboard}>Global leaderboard</button>
      </div>

      {!profile
        ? <div className="regcta">
            <p>Save your score and climb the daily leaderboard.</p>
            <button className="primary" onClick={()=>onRegister({finalScore, distance:totalDist, timePenalty:totalPenalty, exact, completionSec:totalTime, worst:Math.max(...guesses.map(x=>x.distance))})}>
              Save score · Join leaderboard
            </button>
          </div>
        : <div className="regcta done">
            <p>Saved as <b>{profile.displayName}</b>. You're on today's board.</p>
            <button className="primary" onClick={onLeaderboard}>See your rank</button>
          </div>}

      <button className="textlink" onClick={onHome}>Back to home</button>
    </div>
  );
}

export default Results;
