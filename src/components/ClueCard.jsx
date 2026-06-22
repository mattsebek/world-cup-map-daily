import { fmt } from "../lib/util.js";

const CLUE_META = {
  player:{label:"Player",icon:"◆"}, history:{label:"World Cup history",icon:"★"},
  geography:{label:"Geography",icon:"⬢"}, culture:{label:"Culture",icon:"♪"},
};
function ClueCard({q, miniTotal}){
  return (
    <div className="cluecard">
      <div className="cluetop">
        <span className="counter">{q.n} <i>of</i> 5</span>
        <span className={"diff "+q.difficulty.toLowerCase()}>{q.difficulty}</span>
      </div>
      <div className="clues">
        {q.clues.map((c,i)=>(
          <div className="clue" key={i}>
            <span className="ctype"><b>{CLUE_META[c.type]?.icon}</b>{CLUE_META[c.type]?.label||c.type}</span>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className="cluefoot">
        <span className="instr">Tap the country on the globe</span>
        <span className="runtot">Total so far <b>{fmt(miniTotal)} mi</b></span>
      </div>
    </div>
  );
}

export default ClueCard;
