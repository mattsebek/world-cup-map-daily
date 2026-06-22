import { resultLabel, fmt } from "../lib/util.js";
import { flagSrc } from "../lib/flags.js";
import DistanceCounter from "./DistanceCounter.jsx";
import PARTICIPANTS from "../data/participants.json";
import WORLD from "../data/world.json";
import CAPITALS from "../data/capitals.json";

function RevealPanel({q, guessISO, distance, onNext, last, reduced}){
  const lab=resultLabel(distance);
  const exact=guessISO===q.answer;
  const guessName=PARTICIPANTS[guessISO]?.name || WORLD.features.find(f=>f.id===guessISO)?.properties.name || guessISO;
  const gCap=CAPITALS[guessISO]?.capital;
  const ansFlag=flagSrc(q.answer), guessFlag=flagSrc(guessISO);
  return (
    <div className="reveal">
      <div className="revealhead" style={{["--lab"]:lab.c}}>
        <span className="rlabel">{lab.t}</span>
        <span className="rdist"><DistanceCounter value={distance} reduced={reduced}/> <i>mi</i></span>
      </div>
      <div className="answerline">
        {ansFlag
          ? <img className="ansflagimg" src={ansFlag} alt={`Flag of ${q.reveal.title}`}/>
          : <span className="ansflag">✅</span>}
        <div><div className="ansname">{q.reveal.title}</div><div className="anssub">Capital · {q.reveal.capital}</div></div>
      </div>
      {!exact
        ? <div className="guessline">{guessFlag && <img className="ansflagimg sm" src={guessFlag} alt={`Flag of ${guessName}`}/>}<span>Your guess · {guessName}{gCap?` (${gCap})`:""} — {fmt(distance)} mi away</span></div>
        : <div className="guessline exact">Exact country — nailed it.</div>}
      <p className="learn">{q.reveal.body}</p>
      <button className="next" onClick={onNext}>{last?"See final score":"Next question"} →</button>
    </div>
  );
}

export default RevealPanel;
