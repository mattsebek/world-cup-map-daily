import { PALETTE } from "./palette.js";

export const PROFANITY = ["damn","hell","crap","shit","fuck","bitch","ass"];

export function haversineMiles(aLat,aLng,bLat,bLng){
  const R=3958.7613, toR=Math.PI/180;
  const dLat=(bLat-aLat)*toR, dLng=(bLng-aLng)*toR;
  const s=Math.sin(dLat/2)**2 + Math.cos(aLat*toR)*Math.cos(bLat*toR)*Math.sin(dLng/2)**2;
  return Math.round(2*R*Math.asin(Math.min(1,Math.sqrt(s))));
}
export function resultLabel(d){
  if(d===0) return {t:"Perfect Trace", c:PALETTE.green};
  if(d<=250) return {t:"Close Read", c:PALETTE.green};
  if(d<=1000) return {t:"Solid Intel", c:PALETTE.turq};
  if(d<=3000) return {t:"Regional Miss", c:PALETTE.lime};
  if(d<=6000) return {t:"Long Haul", c:PALETTE.coral};
  return {t:"World Away", c:PALETTE.red};
}
export function bandEmoji(d){
  if(d===0) return "\u{1F7E2}"; if(d<=500) return "\u26AA"; if(d<=2000) return "\u{1F7E1}";
  if(d<=5000) return "\u{1F7E0}"; return "\u{1F534}";
}
export const fmt = n => n.toLocaleString("en-US");
export function todayStr(){ return new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}); }
export function fmtTime(sec){
  const s=Math.max(0,Math.round(sec));
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
}
export function agentRank(score){
  if(score<=500) return "World Class Operative";
  if(score<=1500) return "Elite Scout";
  if(score<=3500) return "Field Analyst";
  if(score<=6000) return "Regional Tracker";
  if(score<=10000) return "Rookie Cartographer";
  return "Lost in Transit";
}
