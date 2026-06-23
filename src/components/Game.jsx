import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { haversineMiles } from "../lib/util.js";
import CAPITALS from "../data/capitals.json";
import WORLD from "../data/world.json";
import Globe from "./Globe.jsx";
import ClueCard from "./ClueCard.jsx";
import RevealPanel from "./RevealPanel.jsx";

function Game({questions, onFinish, reduced}){
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState("guessing");
  const [guesses, setGuesses] = useState([]);
  const [displaySec, setDisplaySec] = useState(0);
  const [toast, setToast] = useState(null);

  // Timer refs
  const accRef = useRef(0);
  const tickRef = useRef(Date.now());
  const pausedRef = useRef(false);
  const caseStartRef = useRef(0);
  const guessesRef = useRef([]);

  const q = questions[qi];
  const miniScore = guessesRef.current.reduce((s,g) => s + g.caseScore, 0);

  // Timer display tick — shows per-case elapsed time (resets to 0 on each new case)
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setDisplaySec(Math.floor(
          accRef.current + (Date.now() - tickRef.current) / 1000 - caseStartRef.current
        ));
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  const pauseTimer = useCallback(() => {
    if (!pausedRef.current) {
      accRef.current += (Date.now() - tickRef.current) / 1000;
      pausedRef.current = true;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (pausedRef.current) {
      tickRef.current = Date.now();
      pausedRef.current = false;
    }
  }, []);

  const getElapsedSec = useCallback(() => {
    if (pausedRef.current) return accRef.current;
    return accRef.current + (Date.now() - tickRef.current) / 1000;
  }, []);

  useEffect(() => {
    const h = () => { setToast("Tap a country to submit your selection."); setTimeout(() => setToast(null), 1400); };
    document.addEventListener("wcmd-outside", h);
    return () => document.removeEventListener("wcmd-outside", h);
  }, []);

  const onGuess = (iso) => {
    if (phase !== "guessing") return;
    const caseTimeSec = Math.max(1, Math.round(getElapsedSec() - caseStartRef.current));
    pauseTimer();

    const a = CAPITALS[q.answer], gc = CAPITALS[iso];
    let dist;
    if (iso === q.answer) dist = 0;
    else if (a && gc) dist = haversineMiles(a.lat, a.lng, gc.lat, gc.lng);
    else {
      const cf = WORLD.features.find(f => f.id === iso);
      const c = cf ? d3.geoCentroid(cf) : null;
      dist = (a && c) ? haversineMiles(a.lat, a.lng, c[1], c[0]) : 9999;
    }

    const timePenalty = caseTimeSec * 10;
    const newGuess = {
      answer: q.answer,
      guess: iso,
      distance: dist,
      isExact: iso === q.answer,
      caseTime: caseTimeSec,
      timePenalty,
      caseScore: dist + timePenalty,
    };
    const updated = [...guessesRef.current, newGuess];
    guessesRef.current = updated;
    setGuesses(updated);
    setPhase("revealed");
  };

  const next = () => {
    if (qi < questions.length - 1) {
      caseStartRef.current = accRef.current;
      resumeTimer();
      setQi(qi + 1);
      setPhase("guessing");
    } else {
      onFinish(guessesRef.current, Math.round(accRef.current));
    }
  };

  const cur = guesses[qi];

  return (
    <div className="game">
      <div className="game-map">
        <Globe phase={phase} answerISO={q.answer} guessISO={cur?.guess} onGuess={onGuess} reduced={reduced}/>
        <div className="game-overlay">
          <div className="progress">
            <div className="prog-col">
              <span className="prog-label">Score</span>
              <span className="prog-score">{miniScore.toLocaleString()}</span>
            </div>
            <div className="prog-col prog-col-right">
              <span className="prog-label">Time</span>
              <span className={`prog-score prog-timer${displaySec>=240?" urgent":""}`}>{Math.floor(displaySec/60)}:{String(displaySec%60).padStart(2,"0")}</span>
            </div>
          </div>
          <ClueCard q={q} miniScore={miniScore} elapsed={displaySec}/>
          {phase === "guessing" && <p className="hint-bar">Drag to spin · tap a country to guess</p>}
        </div>
      </div>
      {phase === "revealed" && cur &&
        <div className="revealsheet">
          <div className="revealsheet-inner">
            <div className="sheetgrab"/>
            <RevealPanel
              q={q}
              guessISO={cur.guess}
              distance={cur.distance}
              onNext={next}
              last={qi === questions.length - 1}
              reduced={reduced}
            />
          </div>
        </div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Game;
