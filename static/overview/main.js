import { link } from "../lib/link.js";
import { locations, meta } from "../lib/api.js";
import { renderLocationData } from "../lib/map.js";

window.guiLoaded && (await new Promise((r) => window.guiLoaded.push(r)));

window.expand = async () => {
  await new Promise((r) => setTimeout(r, 500));
  link("../map");
};

window.statsLink = async () => {
  await new Promise((r) => setTimeout(r, 500));
  link("../stats");
};

let stats = await meta.stats(cookie.pwd);
document.getElementById("statsBox").component.setData(stats);

let overview = await locations.getOverview(cookie.pwd);
renderLocationData(overview);
