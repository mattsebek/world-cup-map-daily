import { resultLabel, fmt } from "../lib/util.js";
import { flagSrc } from "../lib/flags.js";
import DistanceCounter from "./DistanceCounter.jsx";
import PARTICIPANTS from "../data/participants.json";
import WORLD from "../data/world-geo.js";
import CAPITALS from "../data/capitals.json";

function RevealPanel({q, guessISO, distance, onNext, last, reduced}){
  const lab = resultLabel(distance);
  const exact = guessISO === q.answer;
  const guessName = PARTICIPANTS[guessISO]?.name || WORLD.features.find(f=>f.id===guessISO)?.properties.name || guessISO;
  const gCap = CAPITALS[guessISO]?.capital;
  const ansFlag = flagSrc(q.answer), guessFlag = flagSrc(guessISO);
  return (
    <div className="reveal">
      <div className="revealhead" style={{["--lab"]:lab.c}}>
        <span className="rlabel"><span className="case-closed-stamp">CASE CLOSED</span></span>
        <span className="rdist"><DistanceCounter value={distance} reduced={reduced}/> <i>mi off trail</i></span>
      </div>
      <div className="answerline">
        {ansFlag
          ? <img className="ansflagimg" src={ansFlag} alt={`Flag of ${q.reveal.title}`}/>
          : <span className="ansflag">✅</span>}
        <div>
          <div className="ansname">{q.reveal.title}</div>
          <div className="anssub">Target Capital · {q.reveal.capital}</div>
        </div>
        {!exact && (
          <div className="guessline inline">
            {guessFlag && <img className="ansflagimg sm" src={guessFlag} alt={`Flag of ${guessName}`}/>}
            <span>Your selection · {guessName}{gCap ? ` (${gCap})` : ""}</span>
          </div>
        )}
        {exact && <div className="guessline exact inline">✓ Exact</div>}
      </div>
      <p className="learn">{q.reveal.body}</p>
      <button className="next" onClick={onNext}>{last ? "Mission Report →" : "Next Case →"}</button>
    </div>
  );
}

export default RevealPanel;
