import { handlers } from "../private/file/collect.js";
import { auth } from "./meta.js";

export const getOverview = async (pwd) => {
  if (!auth(pwd)) return;
  return await handlers.overviewMap();
};
