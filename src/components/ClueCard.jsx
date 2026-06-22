import { fmt, fmtTime } from "../lib/util.js";

const CLUE_META = {
  player:   {label:"Player File",       icon:"◆"},
  history:  {label:"Tournament Record", icon:"★"},
  geography:{label:"Geographic Intel",  icon:"⬢"},
  culture:  {label:"Culture Signal",    icon:"♪"},
};

function ClueCard({q, miniScore, elapsed}){
  const warn = elapsed >= 120;
  const urgent = elapsed >= 240;
  return (
    <div className="cluecard">
      <div className="cluetop">
        <span className="counter">Case <b>{q.n}</b> <i>of 5</i></span>
        <span className={"diff "+q.difficulty.toLowerCase()}>{q.difficulty}</span>
      </div>
      {q.codename && <div className="codename">"{q.codename}"</div>}
      <div className="clues">
        {q.clues.map((c,i)=>(
          <div className="clue" key={i}>
            <span className="ctype"><b>{CLUE_META[c.type]?.icon}</b>{CLUE_META[c.type]?.label||c.type}</span>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className="cluefoot">
        <span className={`mission-clock${warn?" warn":""}${urgent?" urgent":""}`}>
          <span className="clock-label">Mission</span>
          <span className="clock-time">{fmtTime(elapsed)}</span>
        </span>
        <span className="runtot">Score <b>{fmt(miniScore)}</b></span>
      </div>
    </div>
  );
}

export default ClueCard;
