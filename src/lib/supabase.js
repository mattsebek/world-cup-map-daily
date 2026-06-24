import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

async function hashEmail(email) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function fetchTodayBoard() {
  const { data, error } = await supabase
    .from("daily_scores")
    .select("display_name,final_score,distance,time_penalty,exact_count,worst,completion_sec,fav_country")
    .eq("date", today())
    .order("final_score", { ascending: true })
    .limit(20);
  if (error) throw error;
  return data.map(r => ({
    name: r.display_name,
    finalScore: r.final_score,
    distance: r.distance,
    timePenalty: r.time_penalty,
    exact: r.exact_count,
    worst: r.worst,
    time: fmtSec(r.completion_sec),
    fav: r.fav_country,
  }));
}

export async function submitScore({ email, displayName, favoriteCountryId }, score) {
  const email_hash = await hashEmail(email);
  const { error } = await supabase.from("daily_scores").upsert({
    date: today(),
    display_name: displayName,
    email_hash,
    final_score: score.finalScore,
    distance: score.distance,
    time_penalty: score.timePenalty,
    exact_count: score.exact,
    worst: score.worst,
    completion_sec: score.completionSec,
    fav_country: favoriteCountryId || null,
  }, { onConflict: "date,email_hash" });
  if (error) throw error;
}

function fmtSec(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
