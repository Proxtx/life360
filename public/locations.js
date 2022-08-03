import { handlers } from "../private/file/collect.js";
import { auth } from "./meta.js";

export const getOverview = async (pwd) => {
  if (!auth(pwd)) return;
  return await handlers.overviewMap();
};

export const getLocationsInTimespan = async (pwd, users, start, end) => {
  if (!auth(pwd)) return;
  return await handlers.locationsInTimespan(users, start, end);
};
