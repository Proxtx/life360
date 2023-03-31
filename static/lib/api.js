export const meta = await framework.load("meta.js");
export const data = await framework.load("data.js");
export const locations = await framework.load("locations.js");
export const stats = await framework.load("stats.js");

cookie.default =
  "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=None; Secure;";
