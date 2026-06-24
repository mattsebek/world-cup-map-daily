import { PALETTE } from "../lib/palette.js";
import BackdropGlobe from "./BackdropGlobe.jsx";

function Home({onPlay,onHow,onBoard,profile}){
  return (
    <div className="home">
      <BackdropGlobe/>
      <div className="badge26" aria-hidden="true"><span>26</span></div>
      <div className="wordmark"><span className="wm1">World Cup</span><span className="wm2">Geo Challenge</span></div>
      <p className="tag">Five clues. Five countries. Guess them all.</p>
      <button className="play" onClick={onPlay}>Start Game</button>
      <div className="homebtns">
        <button onClick={onHow}>How it works</button>
        <button onClick={onBoard}>Leaderboard</button>
      </div>
      <div className="rulecard">
        <div><b style={{color:PALETTE.turq}}>Review</b> each case file and follow the evidence</div>
        <div><b style={{color:PALETTE.coral}}>Spin</b> the globe and tap the target country</div>
        <div><b style={{color:PALETTE.lime}}>Score</b> = distance off trail + time penalty</div>
        <div><b style={{color:PALETTE.green}}>Win</b> with the lowest final mission score</div>
      </div>
    </div>
  );
}

export default Home;
