import { PALETTE } from "../lib/palette.js";
import BackdropGlobe from "./BackdropGlobe.jsx";

function Home({onPlay,onHow,onBoard,onStats,profile}){
  return (
    <div className="home">
      <BackdropGlobe/>
      <div className="badge26" aria-hidden="true"><span>26</span></div>
      <div className="wordmark"><span className="wm1">World Cup</span><span className="wm2">Map Daily</span></div>
      <p className="tag">A daily World Cup geography challenge.<br/>Five clues. Five countries. Spin the globe.</p>
      <button className="play" onClick={onPlay}>Play today’s round</button>
      <div className="homebtns">
        <button onClick={onHow}>How it works</button>
        <button onClick={onBoard}>Leaderboard</button>
        <button onClick={onStats}>My stats</button>
      </div>
      <div className="rulecard">
        <div><b style={{color:PALETTE.turq}}>Guess</b> the World Cup country from the clues</div>
        <div><b style={{color:PALETTE.coral}}>Spin</b> the globe and tap the country</div>
        <div><b style={{color:PALETTE.lime}}>Score</b> = distance to the correct capital</div>
        <div><b style={{color:PALETTE.green}}>Win</b> with the lowest total distance</div>
      </div>
      {profile && <div className="welcome">Welcome back, {profile.displayName}.</div>}
    </div>
  );
}

export default Home;
