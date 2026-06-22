import { PALETTE } from "../lib/palette.js";
import BackdropGlobe from "./BackdropGlobe.jsx";

function Home({onPlay,onHow,onBoard,onStats,profile}){
  return (
    <div className="home">
      <BackdropGlobe/>
      <div className="badge26" aria-hidden="true"><span>26</span></div>
      <div className="wordmark"><span className="wm1">World Cup</span><span className="wm2">Map Daily</span></div>
      <p className="tag">Five cases. Five countries. Track the trail.</p>
      <button className="play" onClick={onPlay}>Begin Mission</button>
      <div className="homebtns">
        <button onClick={onHow}>How it works</button>
        <button onClick={onBoard}>Leaderboard</button>
        <button onClick={onStats}>My stats</button>
      </div>
      <div className="rulecard">
        <div><b style={{color:PALETTE.turq}}>Review</b> each case file and follow the evidence</div>
        <div><b style={{color:PALETTE.coral}}>Spin</b> the globe and tap the target country</div>
        <div><b style={{color:PALETTE.lime}}>Score</b> = distance off trail + time penalty</div>
        <div><b style={{color:PALETTE.green}}>Win</b> with the lowest final mission score</div>
      </div>
      {profile && <div className="welcome">Welcome back, Agent {profile.displayName}.</div>}
    </div>
  );
}

export default Home;
