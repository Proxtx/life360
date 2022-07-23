import { link } from "../lib/link.js";

window.expand = async () => {
  await new Promise((r) => setTimeout(r, 500));
  link("../map");
};
