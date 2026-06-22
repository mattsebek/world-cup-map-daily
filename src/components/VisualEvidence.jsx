import { useState, useEffect } from "react";

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
  EGY:"Mohamed Salah",     IRN:"Mehdi Taremi",       NZL:"Chris Wood (New Zealand footballer)",
  ESP:"Lamine Yamal",      SAU:"Salem Al-Dawsari",   URY:"Darwin Núñez",
  FRA:"Kylian Mbappé",     SEN:"Sadio Mané",         NOR:"Erling Haaland",
  DZA:"Riyad Mahrez",      AUT:"David Alaba",        PRT:"Cristiano Ronaldo",
  COL:"James Rodríguez",         UZB:"Eldor Shomurodov",   ENG:"Jude Bellingham",
  GHA:"Thomas Partey",
};

function ColorSwatches({ iso }) {
  const colors = FLAG_COLORS[iso] || [];
  return (
    <div className="ve-swatches">
      {colors.map((c, i) => (
        <div key={i} className="ve-swatch" style={{ background: c }}/>
      ))}
    </div>
  );
}

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

  return (
    <div className="ve-player-wrap">
      {src
        ? <img src={src} alt="" className="ve-player-img"/>
        : <div className="ve-player-placeholder">
            <svg viewBox="0 0 60 80" fill="none">
              <circle cx="30" cy="22" r="13" fill="rgba(154,163,199,0.25)"/>
              <path d="M8,76 C8,54 52,54 52,76" fill="rgba(154,163,199,0.25)"/>
            </svg>
          </div>
      }
    </div>
  );
}

function KitSVG({ primaryColor, secondaryColor, iso }) {
  const gid = `kg${iso}`;
  return (
    <svg viewBox="0 0 100 115" className="ve-kit-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.14)"/>
        </linearGradient>
      </defs>
      {/* Body */}
      <path d="M32,26 L10,42 L18,61 L30,57 L30,106 L70,106 L70,57 L82,61 L90,42 L68,26 C63,15 56,13 50,13 C44,13 37,15 32,26Z"
            fill={primaryColor}/>
      {/* Left sleeve */}
      <path d="M32,26 C28,33 10,42 10,42 L18,61 L30,57 L30,44 C31,37 34,30 40,27Z"
            fill={secondaryColor}/>
      {/* Right sleeve */}
      <path d="M68,26 C72,33 90,42 90,42 L82,61 L70,57 L70,44 C69,37 66,30 60,27Z"
            fill={secondaryColor}/>
      {/* Collar back */}
      <path d="M42,13 L50,28 L58,13 C55,10 50,9 50,9 C45,9 42,13 42,13Z"
            fill={secondaryColor}/>
      {/* Collar inner */}
      <path d="M44,15 L50,25 L56,15 C53,12 50,11 50,11 C47,11 44,15 44,15Z"
            fill={primaryColor}/>
      {/* Gradient overlay */}
      <path d="M32,26 L10,42 L18,61 L30,57 L30,106 L70,106 L70,57 L82,61 L90,42 L68,26 C63,15 56,13 50,13 C44,13 37,15 32,26Z"
            fill={`url(#${gid})`}/>
      {/* Shoulder seam */}
      <line x1="30" y1="44" x2="70" y2="44" stroke="rgba(0,0,0,0.12)" strokeWidth="0.7"/>
      {/* Center seam */}
      <line x1="50" y1="27" x2="50" y2="106" stroke="rgba(0,0,0,0.09)" strokeWidth="0.6"/>
      {/* Crest area */}
      <rect x="34" y="46" width="15" height="14" rx="2.5"
            fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7"/>
      {/* Outline */}
      <path d="M32,26 L10,42 L18,61 L30,57 L30,106 L70,106 L70,57 L82,61 L90,42 L68,26 C63,15 56,13 50,13 C44,13 37,15 32,26Z"
            fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.9"/>
    </svg>
  );
}

export function VisualEvidence({ question }) {
  return (
    <div className="ve-wrap">
      <div className="ve-card ve-colors">
        <div className="ve-card-label">Flag Colours</div>
        <ColorSwatches iso={question.answer}/>
      </div>
      <div className="ve-bottom-row">
        <div className="ve-card ve-player">
          <div className="ve-card-label">Star Player</div>
          <PlayerPhoto iso={question.answer}/>
          <div className="ve-card-note">Identity redacted</div>
        </div>
        <div className="ve-card ve-kit">
          <div className="ve-card-label">National Kit</div>
          <div className="ve-kit-wrap">
            <KitSVG
              primaryColor={question.primaryColor}
              secondaryColor={question.secondaryColor}
              iso={question.answer}
            />
          </div>
          <div className="ve-card-note">Colours · identity redacted</div>
        </div>
      </div>
    </div>
  );
}
