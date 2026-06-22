import { useState } from "react";
import { PROFANITY } from "../lib/util.js";
import PARTICIPANTS from "../data/participants.json";

function Register({existingNames, onClose, onDone}){
  const [email,setEmail]=useState(""), [name,setName]=useState(""), [fav,setFav]=useState(""), [err,setErr]=useState("");
  const submit=()=>{
    const n=name.trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ setErr("Enter a valid email."); return; }
    if(n.length<1||n.length>18){ setErr("Display name must be 1–18 characters."); return; }
    if(!/^[A-Za-z0-9 _-]+$/.test(n)){ setErr("Use letters, numbers, spaces, _ or -."); return; }
    if(PROFANITY.some(p=>n.toLowerCase().includes(p))){ setErr("Please choose another name."); return; }
    if(existingNames.map(s=>s.toLowerCase()).includes(n.toLowerCase())){ setErr(`“${n}” is taken. Try ${n}_${Math.floor(Math.random()*90+10)}.`); return; }
    onDone({email, displayName:n, favoriteCountryId:fav||null});
  };
  const parts=Object.entries(PARTICIPANTS).sort((a,b)=>a[1].name.localeCompare(b[1].name));
  return (
    <div className="modalwrap" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Join the leaderboard</h3>
        <p className="msub">Lightweight — no password for the prototype.</p>
        <label className="fld"><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
        <label className="fld"><span>Display name</span><input value={name} maxLength={18} onChange={e=>setName(e.target.value)} placeholder="Up to 18 characters"/></label>
        <label className="fld"><span>Favourite team (optional)</span>
          <select value={fav} onChange={e=>setFav(e.target.value)}>
            <option value="">No preference</option>
            {parts.map(([iso,p])=> <option key={iso} value={iso}>{p.name}</option>)}
          </select></label>
        {err && <div className="ferr">{err}</div>}
        <div className="mbtns"><button className="ghost" onClick={onClose}>Cancel</button><button className="primary" onClick={submit}>Save score</button></div>
      </div>
    </div>
  );
}

export default Register;
