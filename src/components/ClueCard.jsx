import { useState, useEffect } from "react";
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

function PlayerPhoto({ iso }) {
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

  if (!name || (!src)) return null;
  return <img src={src} alt="" className="cv-player-img"/>;
}

function ClueCard({q, miniScore, elapsed}){
  const warn = elapsed >= 120;
  const urgent = elapsed >= 240;
  const swatches = FLAG_COLORS[q.answer] || [];
  const hasPlayer = !!STAR_PLAYERS[q.answer];

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

      <div className="clue-visual">
        <div className="cv-left">
          <div className="cv-label">Flag Colours</div>
          <div className="cv-swatches">
            {swatches.map((c,i)=><div key={i} className="cv-swatch" style={{background:c}}/>)}
          </div>
        </div>
        {hasPlayer && (
          <div className="cv-right">
            <div className="cv-label">Star Player</div>
            <div className="cv-player-wrap">
              <PlayerPhoto iso={q.answer}/>
            </div>
          </div>
        )}
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
