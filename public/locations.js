import { handlers } from "../private/file/collect.js";
import { auth } from "./meta.js";
import { getTimespan } from "../private/file/file.js";
import config from "@proxtx/config";

export const timespan = async (pwd) => {
  if (!auth(pwd)) return;
  return await getTimespan(config.locations);
};

export const getOverview = async (pwd) => {
  if (!auth(pwd)) return;
  return await handlers.overviewMap();
};

export const getLocationsInTimespan = async (pwd, users, start, end) => {
  if (!auth(pwd)) return;
  return await handlers.locationsInTimespan(users, start, end);
};
