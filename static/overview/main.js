import { link } from "../lib/link.js";
import { locations } from "../lib/api.js";
import { renderLocationData } from "../lib/map.js";

window.expand = async () => {
  await new Promise((r) => setTimeout(r, 500));
  link("../map");
};

let overview = await locations.getOverview(cookie.pwd);
renderLocationData(overview);

let latest = Object.keys(overview).sort((a, b) => a - b);
latest = latest[latest.length - 1];
console.log(new Date(Number(latest)));
