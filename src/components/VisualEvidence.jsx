import { flagSrc } from "../lib/flags.js";

function FlagFragmentCard({ iso, difficulty }) {
  const src = flagSrc(iso);
  const clipPct = { easy: 85, medium: 60, hard: 42, expert: 28 }[difficulty?.toLowerCase()] ?? 60;
  const overlayW = `${100 - clipPct}%`;
  return (
    <div className="ve-card">
      <div className="ve-card-label">RECOVERED TEXTILE</div>
      <div className="ve-flag-frame">
        {src
          ? <img src={src} alt="Partial flag fragment" className="ve-flag-img" />
          : <div className="ve-flag-placeholder"/>}
        <div className="ve-flag-overlay" style={{width: overlayW}}/>
      </div>
      <div className="ve-card-note">Fragment recovered · origin redacted</div>
    </div>
  );
}

function KitTraceCard({ primaryColor, secondaryColor }) {
  const p = primaryColor || "#334155";
  const s = secondaryColor || "#94A3B8";
  return (
    <div className="ve-card">
      <div className="ve-card-label">KIT TRACE</div>
      <div className="ve-kit-wrap">
        <svg viewBox="0 0 100 100" className="ve-kit-svg" aria-hidden="true">
          <path
            d="M25,22 L5,32 L12,48 L22,44 L22,92 L78,92 L78,44 L88,48 L95,32 L75,22 Q65,14 50,14 Q35,14 25,22Z"
            fill={p} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
          <path d="M5,32 L12,48 L22,44 L22,36 L10,34Z" fill={s} opacity="0.75"/>
          <path d="M95,32 L88,48 L78,44 L78,36 L90,34Z" fill={s} opacity="0.75"/>
          <path d="M40,14 L50,28 L60,14 Q55,10 50,10 Q45,10 40,14Z" fill={s}/>
        </svg>
      </div>
      <div className="ve-card-note">National colours · identity redacted</div>
    </div>
  );
}

export function VisualEvidence({ question }) {
  return (
    <div className="ve-grid">
      <FlagFragmentCard iso={question.answer} difficulty={question.difficulty}/>
      <KitTraceCard primaryColor={question.primaryColor} secondaryColor={question.secondaryColor}/>
    </div>
  );
}
