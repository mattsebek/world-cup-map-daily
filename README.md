# World Cup Map Daily

A daily World Cup geography game. Each day gives you **5 clues**; every answer is a
country playing in the 2026 World Cup. Spin the interactive **3D globe**, tap the
country you think it is, and your score is the great-circle distance (in miles) from
your guess's capital to the correct country's capital. Exact country = 0 mi.
**Lowest total distance wins.**

Built with React + Vite, a d3-geo orthographic globe, and recharts for stats.
Everything (country geometry, capitals, and all flags) is bundled, so the app runs
fully offline — no API keys or external image hosts.

## Getting started

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

Requires Node 18+.

## Project structure

```
world-cup-map-daily/
├── index.html              # Vite entry
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # screen router + game state (home/game/results/board/stats)
    ├── styles.css          # design tokens (:root vars) + all component styles
    ├── lib/
    │   ├── palette.js      # brand color tokens for JS (charts, inline SVG fills)
    │   ├── util.js         # haversine, score bands, formatting helpers
    │   ├── flags.js        # flagSrc()/flagCode() -> bundled flag PNGs
    │   └── store.js        # localStorage wrapper (profile, history, leaderboard)
    ├── data/
    │   ├── world.json      # simplified Natural Earth country polygons (ISO3-keyed)
    │   ├── capitals.json   # { ISO3: { capital, lat, lng } }
    │   ├── participants.json # 2026 field, grouped A–L
    │   ├── iso2.json       # ISO3 -> ISO2 (for flag codes)
    │   ├── flags.json      # ISO3 -> base64 PNG flag (rasterized + palette-quantized)
    │   ├── questions.js    # the 5 daily questions (clues + reveal)
    │   └── leaderboard.js  # seeded mock leaderboard
    └── components/
        ├── Globe.jsx        # interactive 3D globe (drag/zoom/select) + FlagMarker + Confetti
        ├── BackdropGlobe.jsx# canvas auto-rotating globe behind the home screen
        ├── Home.jsx
        ├── ClueCard.jsx
        ├── Game.jsx
        ├── RevealPanel.jsx
        ├── DistanceCounter.jsx
        ├── Results.jsx
        ├── Leaderboard.jsx
        ├── Stats.jsx
        ├── Register.jsx
        └── HowItWorks.jsx
```

## How scoring works

- Distance per question = Haversine distance between the guessed country's capital and
  the correct country's capital (miles). Exact country = 0.
- Final score = sum of all 5 question distances. Lower is better.
- Leaderboard tie-breakers: lowest total → most exact → lowest worst miss → earliest time.

## Data & rights

- Country geometry: **Natural Earth** (public domain), simplified for size.
- Capitals derived from Natural Earth populated places.
- Flags rasterized from the open-source `flag-icons` set to small bundled PNGs.
- This is an independent fan geography game — **not affiliated with FIFA**, national
  federations, or tournament organizers. Player/kit imagery is intentionally avoided;
  only flags and neutral placeholders are used.

## Notes / next steps

- Player data (profile, streak/history, your leaderboard row) persists in `localStorage`.
- The daily round is currently a fixed sample set in `src/data/questions.js`. For a real
  daily rotation, wire these to a backend or a date-seeded content file and compute the
  active round by date (default reset: America/Chicago).
- Distance is computed client-side for the prototype; in production, score on the server
  to prevent tampering.
