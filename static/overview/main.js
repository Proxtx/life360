import { link } from "../lib/link.js";
import { locations } from "../lib/api.js";
import users from "../lib/users.js";
import { renderLocationData } from "../lib/map.js";

window.expand = async () => {
  await new Promise((r) => setTimeout(r, 500));
  link("../map");
};

let overview = await locations.getOverview(cookie.pwd);
console.log(overview, users);

renderLocationData(overview);
