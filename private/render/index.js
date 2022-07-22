import config from "@proxtx/config";

export const server = (document, options) => {
  if (options.pwd == config.pwd) return options.res.redirect("/overview");
  options.res.redirect("/login");
};
