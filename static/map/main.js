import { renderLocationData } from "../lib/map.js";
import { locations } from "../lib/api.js";

window.guiLoaded && (await new Promise((r) => window.guiLoaded.push(r)));

const head = document.getElementById("head").component;
head.callback = async () => {
  console.log(head.startTime, head.endTime);
  let locs = await locations.getLocationsInTimespan(
    cookie.pwd,
    head.activeUsers,
    head.startTime,
    head.endTime
  );
  renderLocationData(locs);
};
