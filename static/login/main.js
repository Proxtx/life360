import { link } from "../lib/link.js";
import { meta } from "../lib/api.js";

let login = document.getElementById("login");
login.addEventListener("change", async () => {
  cookie.pwd = login.component.value;
  if (!(await meta.auth(cookie.pwd))) login.component.value = "";
  else link("./");
});
