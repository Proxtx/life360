import { auth } from "../../public/meta.js";
import { increaseCounter } from "../stats.js";

export const server = (document, options) => {
  increaseCounter("website visits");
  if (!auth(options.req.cookies.pwd)) options.res.redirect("/login");
};
