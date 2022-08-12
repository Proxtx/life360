import { renderLocationData } from "../lib/map.js";
import { locations } from "../lib/api.js";
import { appear, disappear } from "./stats.js";

window.guiLoaded && (await new Promise((r) => window.guiLoaded.push(r)));

const head = document.getElementById("head").component;
head.callback = async () => {
  if (head.activeUsers.length == 1) appear();
  else disappear();
  let locs = await locations.getLocationsInTimespan(
    cookie.pwd,
    head.activeUsers,
    head.startTime,
    head.endTime
  );
  renderLocationData(locs);
};
