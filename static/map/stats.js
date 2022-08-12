import { link } from "../lib/link.js";

const stats = document.getElementById("stats");

window.stats = stats;

const statsTransition = async () => {
  stats.style.height = "100vh";
  stats.style.width = "100%";
  stats.style.opacity = 0;
  link("../stats", true);
};

export const disappear = () => {
  stats.style.transform = "translate(-50%, 100%)";
};

export const appear = () => {
  stats.style.transform = "translate(-50%, 0%)";
};

stats.addEventListener("click", statsTransition);
