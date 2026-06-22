// Persisted player data via localStorage, with an in-memory fallback
// (e.g. private mode / storage disabled).
const mem = {};
export const store = {
  async get(k){
    try{ const v=localStorage.getItem(k); return v!=null ? JSON.parse(v) : (mem[k] ?? null); }
    catch{ return mem[k] ?? null; }
  },
  async set(k,v){
    mem[k]=v;
    try{ localStorage.setItem(k, JSON.stringify(v)); }catch{}
  },
};
