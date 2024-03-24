let u = new URL(location.href);
const startButton = document.getElementById("startButton");

if (u.searchParams.get("skipWelcome")) {
  startButton.style.display = "none";

  document.getElementById("map").style.opacity = "1";
}

let start = u.searchParams.get("start");
let end = u.searchParams.get("end");

import { locations, data } from "../lib/api.js";
import { renderLocationData } from "../lib/map.js";

startButton.addEventListener("click", async () => {
  document.body.requestFullscreen();
  if (screen) screen.orientation.lock("landscape");
  if (navigator.wakeLock) await navigator.wakeLock.request("screen");
  startButton.style.display = "none";

  document.getElementById("map").style.opacity = "1";

  showDataLoop();
});

const showData = async () => {
  let overview;
  if (!start || !end) overview = await locations.getOverview(cookie.pwd);
  else {
    let users = Object.keys(await data.getUsers(cookie.pwd));
    overview = await locations.getLocationsInTimespan(
      cookie.pwd,
      users,
      Number(start),
      Number(end)
    );
  }
  renderLocationData(overview, false);
};

const showDataLoop = async () => {
  try {
    await showData();
  } catch {}

  await new Promise((r) => setTimeout(r, 30000));
  showDataLoop();
};

if (u.searchParams.get("skipWelcome")) {
  showDataLoop();
}
