window.guiLoaded = [];

import { loadPack } from "/modules/uibuilder/main.js";

await loadPack("/modules/material/components/pack.json", {
  urlPrefix: "/modules/material/",
  customStyleSheets: ["../../lib/overwrite.css"],
});

await loadPack("/lib/components/pack.json", {
  urlPrefix: "/lib/",
});

for (let i of guiLoaded) {
  i();
}
