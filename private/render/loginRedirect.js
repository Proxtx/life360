import { auth } from "../../public/meta.js";

export const server = (document, options) => {
  if (auth(options.req.cookies.pwd)) return options.res.redirect("/overview");
};
