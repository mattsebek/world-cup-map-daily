import FLAGS from "../data/flags.json";
import ISO2 from "../data/iso2.json";

export const flagSrc = (iso)=>{ const b=FLAGS[iso]; return b?`data:image/png;base64,${b}`:null; };
export const flagCode = (iso)=> (ISO2[iso]||iso).toUpperCase();
