import { listen } from "@proxtx/framework";
import config from "@proxtx/config";
import { setConfig } from "@proxtx/framework/static.js";
import { handlers } from "./private/file/collect.js";

console.log(await handlers.users());

setConfig({ ignoreParseHtml: ["/lib/components"] });
await listen(config.port);
console.log("Server running. Port:", config.port);
