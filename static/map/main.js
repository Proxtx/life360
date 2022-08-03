import { renderLocationData } from "../lib/map.js";
import { locations } from "../lib/api.js";

window.guiLoaded && (await new Promise((r) => window.guiLoaded.push(r)));

const head = document.getElementById("head").component;
head.callback = async () => {
  let locs = await locations.getLocationsInTimespan(
    cookie.pwd,
    head.activeUsers,
    2000000,
    null
  );
  renderLocationData(locs);
};
