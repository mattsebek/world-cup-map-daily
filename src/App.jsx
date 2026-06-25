import { useState, useEffect, useCallback } from "react";
import { store } from "./lib/store.js";
import { fetchTodayBoard, submitScore } from "./lib/supabase.js";
import { pickQuestions } from "./lib/questionBank.js";
import Home from "./components/Home.jsx";
import Game from "./components/Game.jsx";
import Results from "./components/Results.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Register from "./components/Register.jsx";
import HowItWorks from "./components/HowItWorks.jsx";

export default function App(){
  const [screen,setScreen]=useState("home");
  const [overlay,setOverlay]=useState(null);
  const [guesses,setGuesses]=useState(null);
  const [questions,setQuestions]=useState(null);
  const [totalTime,setTotalTime]=useState(0);
  const [profile,setProfile]=useState(null);
  const [board,setBoard]=useState([]);
  const [boardLoading,setBoardLoading]=useState(false);
  const [history,setHistory]=useState([]);
  const [reduced,setReduced]=useState(false);
  const [pendingScore,setPendingScore]=useState(null);

  useEffect(()=>{
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    (async()=>{
      const p=await store.get("wcmd:profile"); if(p) setProfile(p);
      const h=await store.get("wcmd:history"); if(h) setHistory(h);
    })();
  },[]);

  const refreshBoard = useCallback(async () => {
    setBoardLoading(true);
    try { setBoard(await fetchTodayBoard()); } catch(e){ console.error("board fetch", e); }
    finally { setBoardLoading(false); }
  }, []);

  // Load board when navigating to it
  useEffect(()=>{ if(screen==="board") refreshBoard(); },[screen, refreshBoard]);

  const finish=(g, totalSec)=>{
    const distance=g.reduce((s,x)=>s+x.distance,0);
    const timePenalty=g.reduce((s,x)=>s+x.timePenalty,0);
    const finalScore=g.reduce((s,x)=>s+x.caseScore,0);
    setGuesses(g);
    setTotalTime(totalSec);
    setScreen("results");
    const d=new Date(); const today=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const rec={
      date:today, finalScore, distance, timePenalty,
      completionSec:totalSec,
      exact:g.filter(x=>x.isExact).length,
      worst:Math.max(...g.map(x=>x.distance)),
    };
    const nh=[...history.filter(h=>h.date!==rec.date), rec];
    setHistory(nh); store.set("wcmd:history", nh);
    // If already registered, submit score immediately
    if(profile) submitScore(profile, rec).catch(console.error);
  };

  const doRegister=async (p)=>{
    setProfile(p); store.set("wcmd:profile", p);
    if(pendingScore){
      try { await submitScore(p, pendingScore); } catch(e){ console.error("submit", e); }
    }
    setOverlay(null);
  };

  return (
    <div className="app">
      <header className="topbar">
        <button className="logo" onClick={()=>setScreen("home")}><span className="lmark"/>WCMD</button>
        <nav>
          <button onClick={()=>setScreen("board")} className={screen==="board"?"on":""}>Leaderboard</button>
          <button onClick={()=>setOverlay("how")}>Rules</button>
        </nav>
      </header>
      <main className={screen==="game"?"game-active":""}>
        {screen==="home" && <Home profile={profile} onPlay={()=>{ setQuestions(pickQuestions()); setScreen("game"); }} onHow={()=>setOverlay("how")} onBoard={()=>{ setScreen("board"); }}/>}
        {screen==="game" && questions && <Game questions={questions} onFinish={finish} reduced={reduced}/>}
        {screen==="results" && guesses && questions && <Results guesses={guesses} questions={questions} totalTime={totalTime} profile={profile} reduced={reduced}
            onRegister={(s)=>{ setPendingScore(s); setOverlay("register"); }}
            onLeaderboard={()=>setScreen("board")} onHome={()=>setScreen("home")}/>}
        {screen==="board" && <Leaderboard entries={board} loading={boardLoading} meName={profile?.displayName} onBack={()=>setScreen(guesses?"results":"home")}/>}
      </main>
      <footer className="appfoot">Independent fan game · not affiliated with FIFA or any federation · geometry © Natural Earth (public domain)</footer>
      {overlay==="how" && <HowItWorks onClose={()=>setOverlay(null)}/>}
      {overlay==="register" && <Register existingNames={board.map(b=>b.name)} onClose={()=>setOverlay(null)} onDone={doRegister}/>}
    </div>
  );
}
