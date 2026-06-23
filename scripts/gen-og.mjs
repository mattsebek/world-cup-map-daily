import sharp from "sharp";
import { writeFileSync } from "fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="30%" cy="35%" r="80%">
      <stop offset="0%" stop-color="#0d1640"/>
      <stop offset="100%" stop-color="#06061A"/>
    </radialGradient>
    <radialGradient id="ocean" cx="38%" cy="32%" r="78%">
      <stop offset="0%" stop-color="#10204f"/>
      <stop offset="62%" stop-color="#0a1535"/>
      <stop offset="100%" stop-color="#06061A"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="rgba(0,240,216,0)"/>
      <stop offset="90%" stop-color="rgba(0,240,216,0.12)"/>
      <stop offset="100%" stop-color="rgba(0,240,216,0)"/>
    </radialGradient>
    <clipPath id="globeclip">
      <circle cx="870" cy="315" r="310"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="315" x2="1200" y2="315" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- Globe circle -->
  <circle cx="870" cy="315" r="320" fill="rgba(0,240,216,0.06)"/>
  <circle cx="870" cy="315" r="310" fill="url(#ocean)" stroke="rgba(0,240,216,0.2)" stroke-width="1.5"/>

  <!-- Globe graticule lines -->
  <ellipse cx="870" cy="315" rx="310" ry="93" fill="none" stroke="rgba(100,130,220,0.10)" stroke-width="0.8"/>
  <ellipse cx="870" cy="315" rx="310" ry="186" fill="none" stroke="rgba(100,130,220,0.10)" stroke-width="0.8"/>
  <line x1="560" y1="315" x2="1180" y2="315" stroke="rgba(100,130,220,0.10)" stroke-width="0.8"/>
  <line x1="714" y1="8" x2="714" y2="622" stroke="rgba(100,130,220,0.08)" stroke-width="0.8" clip-path="url(#globeclip)"/>
  <line x1="870" y1="5" x2="870" y2="625" stroke="rgba(100,130,220,0.08)" stroke-width="0.8" clip-path="url(#globeclip)"/>
  <line x1="1026" y1="8" x2="1026" y2="622" stroke="rgba(100,130,220,0.08)" stroke-width="0.8" clip-path="url(#globeclip)"/>

  <!-- Glow ring -->
  <circle cx="870" cy="315" r="340" fill="url(#glow)"/>

  <!-- Left content area -->

  <!-- App icon -->
  <rect x="72" y="72" width="72" height="72" rx="18" fill="#ffd700"/>
  <rect x="72" y="72" width="72" height="72" rx="18" fill="url(#icongrad)" opacity="0.8"/>
  <text x="108" y="126" font-family="'Arial Black', sans-serif" font-size="34" font-weight="900" fill="#06061A" text-anchor="middle">26</text>

  <!-- World Cup label -->
  <text x="72" y="196" font-family="'Arial', sans-serif" font-size="22" font-weight="400" fill="rgba(255,255,255,0.6)" letter-spacing="2">WORLD CUP</text>

  <!-- Map Daily -->
  <text x="72" y="276" font-family="'Arial Black', sans-serif" font-size="84" font-weight="900" fill="#ffffff" letter-spacing="-2">Map</text>
  <text x="242" y="276" font-family="'Arial Black', sans-serif" font-size="84" font-weight="900" fill="#9b59f5" letter-spacing="-2"> Daily</text>

  <!-- Tagline -->
  <text x="74" y="328" font-family="'Arial', sans-serif" font-size="22" fill="rgba(255,255,255,0.55)" letter-spacing="0.5">Five cases. Five countries. Track the trail.</text>

  <!-- Divider -->
  <line x1="72" y1="368" x2="380" y2="368" stroke="rgba(0,240,216,0.3)" stroke-width="1.5"/>

  <!-- Stats row -->
  <text x="72" y="410" font-family="'Arial Black', sans-serif" font-size="15" font-weight="700" fill="rgba(0,240,216,0.9)" letter-spacing="1">DAILY</text>
  <text x="135" y="410" font-family="'Arial', sans-serif" font-size="15" fill="rgba(255,255,255,0.4)">·</text>
  <text x="148" y="410" font-family="'Arial Black', sans-serif" font-size="15" font-weight="700" fill="rgba(0,240,216,0.9)" letter-spacing="1">FREE</text>
  <text x="207" y="410" font-family="'Arial', sans-serif" font-size="15" fill="rgba(255,255,255,0.4)">·</text>
  <text x="220" y="410" font-family="'Arial Black', sans-serif" font-size="15" font-weight="700" fill="rgba(0,240,216,0.9)" letter-spacing="1">GLOBAL LEADERBOARD</text>

  <!-- URL -->
  <text x="72" y="556" font-family="'Arial', sans-serif" font-size="18" fill="rgba(255,255,255,0.3)" letter-spacing="0.5">worldcupmapda.ily</text>
</svg>`;

const buf = Buffer.from(svg);
const png = await sharp(buf).png().toBuffer();
writeFileSync("public/og-image.png", png);
console.log("Generated public/og-image.png");
