import { stats } from "../lib/api.js";

window.guiLoaded && (await new Promise((r) => window.guiLoaded.push(r)));

const head = document.getElementById("head").component;

let statusDisplay = document.getElementById("status");
let prevBoxes = [];

const loadStats = async () => {
  statusDisplay.innerText = "sending request";

  for (let box of prevBoxes) {
    box.component.disappear();
    setTimeout(() => (box.style.display = "none"), 1000);
    await new Promise((r) => setTimeout(r, 100));
  }

  prevBoxes = [];

  let id = await stats.createStatsJob(
    cookie.pwd,
    head.activeUsers[0],
    head.startTime,
    head.endTime
  );

  let result;

  while (!result) {
    let status = await stats.statsJobStatus(cookie.pwd, id);
    if (status.result) {
      result = status.result;
    }
    statusDisplay.innerText = status.status;

    await new Promise((r) => setTimeout(r, 500));
  }

  for (let entry of result) {
    let dataBox = document.createElement("data-box");
    await uiBuilder.ready(dataBox);
    dataBox.component.setData(entry);
    let transitionBox = document.createElement("transition-box");
    transitionBox.appendChild(dataBox);
    document.body.appendChild(transitionBox);
    prevBoxes.push(transitionBox);
  }
};

head.callback = async () => {
  await loadStats();
};
