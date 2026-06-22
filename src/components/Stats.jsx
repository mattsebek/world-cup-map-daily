import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fmt } from "../lib/util.js";

function Stats({history, onBack}){
  if(!history || history.length===0)
    return <div className="board"><div className="bhead"><h2>My stats</h2></div><div className="empty">Play today’s round to start your streak.</div><button className="textlink" onClick={onBack}>Back</button></div>;
  const best=Math.min(...history.map(h=>h.total));
  const avg=Math.round(history.reduce((s,h)=>s+h.total,0)/history.length);
  const exact=history.reduce((s,h)=>s+h.exact,0);
  const data=history.slice(-10).map((h,i)=>({name:`R${i+1}`, score:h.total}));
  return (
    <div className="board">
      <div className="bhead"><h2>My stats</h2></div>
      <div className="statcards">
        <div className="sc"><span>Current streak</span><b>{history.length}</b></div>
        <div className="sc"><span>Best score</span><b>{fmt(best)}</b></div>
        <div className="sc"><span>Average</span><b>{fmt(avg)}</b></div>
        <div className="sc"><span>Exact guesses</span><b>{exact}</b></div>
      </div>
      <div className="chartwrap">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{top:8,right:10,left:-12,bottom:0}}>
            <CartesianGrid stroke="rgba(255,255,255,.07)"/>
            <XAxis dataKey="name" stroke="#9AA3C7" fontSize={11}/>
            <YAxis stroke="#9AA3C7" fontSize={11}/>
            <Tooltip contentStyle={{background:"#121636",border:"1px solid rgba(255,255,255,.12)",borderRadius:10,color:"#F4F7FF"}}/>
            <Line type="monotone" dataKey="score" stroke="#00F0D8" strokeWidth={2.4} dot={{r:3,fill:"#00F0D8"}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <button className="textlink" onClick={onBack}>Back</button>
    </div>
  );
}

export default Stats;
