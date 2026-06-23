import { fmt, todayStr } from "../lib/util.js";
import { flagSrc } from "../lib/flags.js";

function Leaderboard({entries, loading, meName, onBack}){
  const ranked=[...entries].sort((a,b)=>
    (a.finalScore??a.total)-(b.finalScore??b.total) ||
    b.exact-a.exact ||
    a.worst-b.worst ||
    a.time.localeCompare(b.time)
  );
  const meIdx=ranked.findIndex(e=>e.name===meName);
  return (
    <div className="board">
      <div className="bhead"><h2>Global Leaderboard</h2><span>{todayStr()}</span></div>
      {loading
        ? <div className="empty">Loading…</div>
        : ranked.length===0
        ? <div className="empty">No scores yet today.</div>
        : <div className="btable">
            <div className="bthead">
              <span>#</span><span>Agent</span>
              <span className="ra">Score</span>
              <span className="ra hideS">Distance</span>
              <span className="ra hideS">Time</span>
            </div>
            {ranked.slice(0,20).map((e,i)=>(
              <div className={"btrow"+(e.name===meName?" me":"")} key={e.name+i}>
                <span className="brk">{i===0?"🏆":i+1}</span>
                <span className="bname">
                  {e.name}{e.name===meName?" (you)":""}
                  {e.fav && flagSrc(e.fav) && <img src={flagSrc(e.fav)} alt="" className="bflag"/>}
                </span>
                <span className="ra">{fmt(e.finalScore??e.total)}</span>
                <span className="ra hideS">{e.distance!=null?fmt(e.distance)+" mi":"—"}</span>
                <span className="ra hideS">{e.time}</span>
              </div>
            ))}
          </div>
        }
      {meIdx>=20 && <div className="mepin">Your rank · #{meIdx+1}</div>}
      <button className="textlink" onClick={onBack}>Back</button>
    </div>
  );
}

export default Leaderboard;
