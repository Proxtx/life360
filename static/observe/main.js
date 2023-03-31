import { locations } from "../lib/api.js";
import { renderLocationData } from "../lib/map.js";

let u = new URL(location.href);

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
  document.body.requestFullscreen();
  if (screen) screen.orientation.lock("landscape");
  if (navigator.wakeLock) await navigator.wakeLock.request("screen");
  startButton.style.display = "none";

  document.getElementById("map").style.display = "unset";

  showDataLoop();
});

const showData = async () => {
  let overview = await locations.getOverview(cookie.pwd);
  renderLocationData(overview);
};

const showDataLoop = async () => {
  try {
    await showData();
  } catch {}

  await new Promise((r) => setTimeout(r, 30000));
  showDataLoop();
};

if (u.searchParams.get("skipWelcome")) {
  startButton.style.display = "none";

  document.getElementById("map").style.display = "unset";

  showDataLoop();
}
