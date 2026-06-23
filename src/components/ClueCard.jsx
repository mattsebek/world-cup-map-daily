import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { fmt, fmtTime } from "../lib/util.js";

const CLUE_META = {
  player:   {label:"Player File",       icon:"◆"},
  history:  {label:"Tournament Record", icon:"★"},
  geography:{label:"Geographic Intel",  icon:"⬢"},
  culture:  {label:"Culture Signal",    icon:"♪"},
};

const FLAG_COLORS = {
  ARG:["#74ACDF","#FFFFFF","#F4B800"], JPN:["#BC002D","#FFFFFF"],
  MAR:["#C1272D","#006233"],           HRV:["#FF0000","#FFFFFF","#0B2161"],
  BRA:["#009C3B","#FFE000","#003087"], MEX:["#006847","#FFFFFF","#CE1126"],
  ZAF:["#007A4D","#FFB81C","#002395"], KOR:["#C60C30","#003478","#FFFFFF"],
  CZE:["#D7141A","#FFFFFF","#11457E"], CAN:["#FF0000","#FFFFFF"],
  CHE:["#FF0000","#FFFFFF"],           QAT:["#8D153A","#FFFFFF"],
  BIH:["#002395","#FFCC00","#FFFFFF"], GBR:["#003399","#FFFFFF"],
  HTI:["#00209F","#D21034"],           USA:["#B22234","#FFFFFF","#3C3B6E"],
  PRY:["#D52B1E","#FFFFFF","#002B7F"], AUS:["#00008B","#FFFFFF","#FF0000"],
  TUR:["#E30A17","#FFFFFF"],           DEU:["#000000","#DD0000","#FFCE00"],
  ECU:["#FFD100","#003893","#EF3340"], CIV:["#F77F00","#FFFFFF","#009A44"],
  CUW:["#002B7F","#F9E814","#FFFFFF"], NLD:["#AE1C28","#FFFFFF","#21468B"],
  SWE:["#006AA7","#FECC02"],           TUN:["#E70013","#FFFFFF"],
  BEL:["#000000","#EF2B2D","#FAE042"], EGY:["#CE1126","#FFFFFF","#000000"],
  IRN:["#239F40","#FFFFFF","#DA0000"], NZL:["#00247D","#FFFFFF","#CC142B"],
  ESP:["#C60B1E","#FFD700"],           CPV:["#003893","#CF2027","#F7D731"],
  SAU:["#006C35","#FFFFFF"],           URY:["#75AADB","#FFFFFF","#FFD100"],
  FRA:["#002395","#FFFFFF","#ED2939"], SEN:["#00853F","#FDEF42","#E31B23"],
  NOR:["#EF2B2D","#FFFFFF","#002868"], IRQ:["#CE1126","#FFFFFF","#000000"],
  DZA:["#006233","#FFFFFF","#D21034"], AUT:["#ED2939","#FFFFFF"],
  JOR:["#000000","#CE1126","#007A3D"], PRT:["#006600","#CC0000","#FFD700"],
  COD:["#007FFF","#F7D618","#CE1126"], COL:["#FCD116","#003087","#CE1126"],
  UZB:["#009FCA","#FFFFFF","#1EB53A"], ENG:["#CF142B","#FFFFFF"],
  GHA:["#CE1126","#FCD116","#006B3F"], PAN:["#DA121A","#FFFFFF","#004B87"],
};

const STAR_PLAYERS = {
  ARG:"Lionel Messi",      JPN:"Kaoru Mitoma",      MAR:"Achraf Hakimi",
  HRV:"Luka Modrić",      BRA:"Vinícius Júnior",   MEX:"Guillermo Ochoa",
  ZAF:"Percy Tau",         KOR:"Son Heung-min",      CZE:"Patrik Schick",
  CAN:"Alphonso Davies",   CHE:"Granit Xhaka",       QAT:"Akram Afif",
  BIH:"Edin Džeko",        GBR:"Andrew Robertson",  USA:"Christian Pulisic",
  PRY:"Miguel Almirón",    AUS:"Mathew Leckie",      TUR:"Arda Güler",
  DEU:"Jamal Musiala",     ECU:"Enner Valencia",     CIV:"Didier Drogba",
  NLD:"Virgil van Dijk",   SWE:"Alexander Isak",     BEL:"Kevin De Bruyne",
  EGY:"Mohamed Salah",     IRN:"Mehdi Taremi",
  NZL:"Chris Wood (New Zealand footballer)",
  ESP:"Lamine Yamal",      SAU:"Salem Al-Dawsari",   URY:"Darwin Núñez",
  FRA:"Kylian Mbappé",     SEN:"Sadio Mané",         NOR:"Erling Haaland",
  DZA:"Riyad Mahrez",      AUT:"David Alaba",        PRT:"Cristiano Ronaldo",
  COL:"James Rodríguez",   UZB:"Eldor Shomurodov",   ENG:"Jude Bellingham",
  GHA:"Thomas Partey",
};

function PlayerCard({ iso }) {
  const [src, setSrc] = useState(null);
  const name = STAR_PLAYERS[iso];
  useEffect(() => {
    if (!name) return;
    const ctrl = new AbortController();
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      { signal: ctrl.signal }
    )
      .then(r => r.json())
      .then(d => { if (d.thumbnail?.source) setSrc(d.thumbnail.source); })
      .catch(() => {});
    return () => ctrl.abort();
  }, [name]);

  if (!name) return null;
  return (
    <div className="carousel-card carousel-player">
      <div className="cc-label">Star Player</div>
      <div className="cc-player-body">
        {src && <img src={src} alt="" className="cc-player-img"/>}
        <span className="cc-player-name">{name.replace(/ \(.*\)/, "")}</span>
      </div>
    </div>
  );
}

function FlagCard({ colors }) {
  return (
    <div className="carousel-card carousel-flag">
      <div className="cc-label">Flag Colours</div>
      <div className="cc-swatches">
        {colors.map((c, i) => <div key={i} className="cc-swatch" style={{background:c}}/>)}
      </div>
    </div>
  );
}

function ClueTextCard({ clue }) {
  const meta = CLUE_META[clue.type] || {label: clue.type, icon:"·"};
  return (
    <div className="carousel-card carousel-clue">
      <div className="cc-label"><b>{meta.icon}</b> {meta.label}</div>
      <p className="cc-text">{clue.text}</p>
    </div>
  );
}

function Carousel({ cards, resetKey }) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);
  const isHoriz = useRef(null); // null=undecided, true=horiz, false=vert

  useEffect(() => { setIdx(0); }, [resetKey]);

  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx(i => Math.min(cards.length - 1, i + 1)), [cards.length]);

  // Non-passive touch listener so we can preventDefault on horizontal swipes
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onStart = (e) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      isHoriz.current = null;
      setDragging(true);
      setDragX(0);
    };
    const onMove = (e) => {
      if (startX.current === null) return;
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      if (isHoriz.current === null) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        isHoriz.current = Math.abs(dx) > Math.abs(dy);
      }
      if (!isHoriz.current) return;
      e.preventDefault();
      setDragX(dx);
    };
    const onEnd = (e) => {
      if (startX.current === null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      setDragging(false);
      setDragX(0);
      startX.current = null;
      if (isHoriz.current && Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
      }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const trackStyle = {
    transform: `translateX(calc(${-idx * 100}% + ${dragX}px))`,
    transition: dragging ? "none" : "transform 0.25s ease",
  };

  return (
    <div className="carousel">
      <button className="carousel-arrow left" onClick={prev} disabled={idx === 0} aria-label="Previous">‹</button>
      <div className="carousel-viewport" ref={viewportRef}>
        <div className="carousel-track" style={trackStyle}>
          {cards.map((card, i) => (
            <div className="carousel-slide" key={i}>
              {card.kind === "clue"   && <ClueTextCard clue={card.data}/>}
              {card.kind === "flag"   && <FlagCard colors={card.colors}/>}
              {card.kind === "player" && <PlayerCard iso={card.iso}/>}
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {cards.map((_, i) => (
            <button key={i} className={"cdot"+(i===idx?" active":"")} onClick={()=>setIdx(i)} aria-label={`Card ${i+1}`}/>
          ))}
        </div>
      </div>
      <button className="carousel-arrow right" onClick={next} disabled={idx === cards.length - 1} aria-label="Next">›</button>
    </div>
  );
}

function ClueCard({q, miniScore, elapsed}){
  const urgent = elapsed >= 240;

  const cards = useMemo(() => [
    ...q.clues.slice(0, 3).map(c => ({ kind: "clue", data: c })),
    ...(FLAG_COLORS[q.answer]?.length ? [{ kind: "flag", colors: FLAG_COLORS[q.answer] }] : []),
    ...(STAR_PLAYERS[q.answer] ? [{ kind: "player", iso: q.answer }] : []),
  ], [q.n]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="cluecard">
      <div className="case-header">
        <span className="case-label">Case {q.n} <span className="case-of">of 5</span></span>
        <span className={"diff "+q.difficulty.toLowerCase()}>{q.difficulty}</span>
      </div>
      <div className="case-body">
        <div className="case-scorebox">
          <span className="csb-label">Score</span>
          <span className="csb-score">{fmt(miniScore)}</span>
          <span className={`csb-timer${urgent?" urgent":""}`}>{fmtTime(elapsed)}</span>
        </div>
        <Carousel cards={cards} resetKey={q.n}/>
      </div>
    </div>
  );
}

export default ClueCard;
