function HowItWorks({onClose}){
  return (
    <div className="modalwrap" onClick={onClose}>
      <div className="modal wide" onClick={e=>e.stopPropagation()}>
        <h3>How it works</h3>
        <ol className="howol">
          <li>You get 5 clues a day. Every answer is a country playing in the 2026 World Cup.</li>
          <li>Spin the globe, then tap that country (or pick it from the list).</li>
          <li>Your score is the distance from your guess’s capital to the correct capital.</li>
          <li>Exact country = 0 mi. Lowest total distance wins.</li>
        </ol>
        <p className="disc">Independent fan geography game — not affiliated with FIFA, national federations, or tournament organizers. Players and kits use neutral placeholders only.</p>
        <button className="primary" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

export default HowItWorks;
