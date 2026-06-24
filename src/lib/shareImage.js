import { fmt, fmtTime } from "./util.js";
import { flagSrc } from "./flags.js";

const W = 1080, H = 1200;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function bandColor(d) {
  if (d === 0)     return { bg: "rgba(0,200,120,0.25)", border: "#5BFFC9", text: "#5BFFC9" };
  if (d <= 500)    return { bg: "rgba(0,200,120,0.12)", border: "#5BFFC9", text: "#5BFFC9" };
  if (d <= 2000)   return { bg: "rgba(245,208,32,0.12)", border: "#f5d020", text: "#f5d020" };
  if (d <= 5000)   return { bg: "rgba(255,140,0,0.12)", border: "#ff8c00", text: "#ff8c00" };
  return             { bg: "rgba(255,59,73,0.12)", border: "#FF3B49", text: "#FF3B49" };
}

async function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateShareImage(guesses, questions, totalTime, finalScore) {
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background gradient
  const bg = ctx.createRadialGradient(W * 0.28, H * 0.22, 0, W * 0.5, H * 0.5, W * 0.9);
  bg.addColorStop(0, "#0d1640");
  bg.addColorStop(1, "#06061A");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle globe grid lines
  ctx.strokeStyle = "rgba(100,130,220,0.07)";
  ctx.lineWidth = 1;
  [0.25, 0.5, 0.75].forEach(f => {
    ctx.beginPath(); ctx.moveTo(0, H * f); ctx.lineTo(W, H * f); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W * f, 0); ctx.lineTo(W * f, H); ctx.stroke();
  });

  // ── Header ──
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0,240,216,0.7)";
  ctx.font = "bold 36px 'Arial', sans-serif";
  ctx.letterSpacing = "0.12em";
  ctx.fillText("WORLD CUP GEO CHALLENGE", W / 2, 88);

  const d = new Date();
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "30px 'Arial', sans-serif";
  ctx.fillText(d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), W / 2, 136);

  // ── Big score ──
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 168px 'Arial Black', 'Arial', sans-serif";
  ctx.fillText(fmt(finalScore), W / 2, 330);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "32px 'Arial', sans-serif";
  ctx.fillText("Final Score  ·  Lower is better", W / 2, 385);

  // Divider
  ctx.strokeStyle = "rgba(0,240,216,0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W * 0.12, 418); ctx.lineTo(W * 0.88, 418); ctx.stroke();

  // ── 5 flag cards ──
  const cardW = 156, cardH = 190, gap = 18;
  const totalRowW = 5 * cardW + 4 * gap;
  const startX = (W - totalRowW) / 2;
  const cardY = 446;

  for (let i = 0; i < guesses.length; i++) {
    const g = guesses[i];
    const x = startX + i * (cardW + gap);
    const band = bandColor(g.distance);

    // Card bg
    ctx.fillStyle = band.bg;
    roundRect(ctx, x, cardY, cardW, cardH, 18);
    ctx.fill();

    // Card border
    ctx.strokeStyle = band.border;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, cardY, cardW, cardH, 18);
    ctx.stroke();

    // Flag
    const src = flagSrc(g.answer);
    if (src) {
      const img = await loadImage(src);
      if (img) {
        const fW = 100, fH = 68;
        const fx = x + (cardW - fW) / 2;
        const fy = cardY + 22;
        // Clip flag to rounded rect
        ctx.save();
        roundRect(ctx, fx, fy, fW, fH, 6);
        ctx.clip();
        ctx.drawImage(img, fx, fy, fW, fH);
        ctx.restore();
      }
    }

    // Country number
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "bold 22px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${i + 1}`, x + cardW / 2, cardY + cardH - 54);

    // Distance / exact
    ctx.fillStyle = band.text;
    ctx.font = `bold 24px 'Arial', sans-serif`;
    ctx.fillText(g.isExact ? "✓ Exact" : `${fmt(g.distance)} mi`, x + cardW / 2, cardY + cardH - 22);
  }

  // ── Stats row ──
  const exact = guesses.filter(g => g.isExact).length;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "34px 'Arial', sans-serif";
  ctx.fillText(`${exact} exact  ·  Time ${fmtTime(totalTime)}`, W / 2, cardY + cardH + 66);

  // ── Bottom divider + URL ──
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W * 0.12, H - 108); ctx.lineTo(W * 0.88, H - 108); ctx.stroke();

  ctx.fillStyle = "rgba(0,240,216,0.55)";
  ctx.font = "bold 32px 'Arial', sans-serif";
  ctx.fillText("worldcupmapda.ily", W / 2, H - 56);

  return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
}
