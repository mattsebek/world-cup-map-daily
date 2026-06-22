import { useState, useEffect } from "react";
import { store } from "./lib/store.js";
import { fmtTime } from "./lib/util.js";
import { SEED_LEADERBOARD } from "./data/leaderboard.js";
import { pickQuestions } from "./lib/questionBank.js";
import Home from "./components/Home.jsx";
import Game from "./components/Game.jsx";
import Results from "./components/Results.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Stats from "./components/Stats.jsx";
import Register from "./components/Register.jsx";
import HowItWorks from "./components/HowItWorks.jsx";

export default function App(){
  const [screen,setScreen]=useState("home");
  const [overlay,setOverlay]=useState(null);
  const [guesses,setGuesses]=useState(null);
  const [questions,setQuestions]=useState(null);
  const [totalTime,setTotalTime]=useState(0);
  const [profile,setProfile]=useState(null);
  const [board,setBoard]=useState(SEED_LEADERBOARD);
  const [history,setHistory]=useState([]);
  const [reduced,setReduced]=useState(false);
  const [pendingScore,setPendingScore]=useState(null);

  useEffect(()=>{
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    (async()=>{
      const p=await store.get("wcmd:profile"); if(p) setProfile(p);
      const h=await store.get("wcmd:history"); if(h) setHistory(h);
      const b=await store.get("wcmd:board"); if(b) setBoard(b);
    })();
  },[]);

  const addToBoard=(prof, rec)=>{
    const entry={
      name:prof.displayName,
      finalScore:rec.finalScore,
      distance:rec.distance,
      timePenalty:rec.timePenalty,
      exact:rec.exact,
      worst:rec.worst,
      time:fmtTime(rec.completionSec),
      fav:prof.favoriteCountryId||""
    };
    setBoard(prev=>{ const nb=[...prev.filter(e=>e.name!==entry.name), entry]; store.set("wcmd:board", nb); return nb; });
  };

  const finish=(g, totalSec)=>{
    const distance=g.reduce((s,x)=>s+x.distance,0);
    const timePenalty=g.reduce((s,x)=>s+x.timePenalty,0);
    const finalScore=g.reduce((s,x)=>s+x.caseScore,0);
    setGuesses(g);
    setTotalTime(totalSec);
    setScreen("results");
    const today=new Date().toISOString().slice(0,10);
    const rec={
      date:today,
      total:distance,
      finalScore,
      distance,
      timePenalty,
      completionSec:totalSec,
      exact:g.filter(x=>x.isExact).length,
      worst:Math.max(...g.map(x=>x.distance)),
      completedAt:new Date().toISOString()
    };
    const nh=[...history.filter(h=>h.date!==rec.date), rec];
    setHistory(nh); store.set("wcmd:history", nh);
    if(profile) addToBoard(profile, rec);
  };

  const doRegister=(p)=>{
    setProfile(p); store.set("wcmd:profile", p);
    if(pendingScore) addToBoard(p, {...pendingScore, completedAt:new Date().toISOString()});
    setOverlay(null);
  };

  return (
    <div className="app">
      <header className="topbar">
        <button className="logo" onClick={()=>setScreen("home")}><span className="lmark"/>WCMD</button>
        <nav>
          <button onClick={()=>setScreen("board")} className={screen==="board"?"on":""}>Leaderboard</button>
          <button onClick={()=>setScreen("stats")} className={screen==="stats"?"on":""}>Stats</button>
          <button onClick={()=>setOverlay("how")}>Rules</button>
        </nav>
      </header>
      <main>
        {screen==="home" && <Home profile={profile} onPlay={()=>{ setQuestions(pickQuestions()); setScreen("game"); }} onHow={()=>setOverlay("how")} onBoard={()=>setScreen("board")} onStats={()=>setScreen("stats")}/>}
        {screen==="game" && questions && <Game questions={questions} onFinish={finish} reduced={reduced}/>}
        {screen==="results" && guesses && questions && <Results guesses={guesses} questions={questions} totalTime={totalTime} profile={profile} reduced={reduced}
            onRegister={(s)=>{ setPendingScore(s); setOverlay("register"); }}
            onLeaderboard={()=>setScreen("board")} onHome={()=>setScreen("home")}/>}
        {screen==="board" && <Leaderboard entries={board} meName={profile?.displayName} onBack={()=>setScreen(guesses?"results":"home")}/>}
        {screen==="stats" && <Stats history={history} onBack={()=>setScreen("home")}/>}
      </main>
      <footer className="appfoot">Independent fan geography game · not affiliated with FIFA or any federation · geometry © Natural Earth (public domain)</footer>
      {overlay==="how" && <HowItWorks onClose={()=>setOverlay(null)}/>}
      {overlay==="register" && <Register existingNames={board.map(b=>b.name)} onClose={()=>setOverlay(null)} onDone={doRegister}/>}
    </div>
  );
}
