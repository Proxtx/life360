import config from "@proxtx/config";
import { getCounters, getCounter, increaseCounter } from "../private/stats.js";

export const auth = (pwd) => {
  let attempt = config.pwd == pwd;
  increaseCounter("login attempts");
  if (attempt) increaseCounter("successful logins");
  else increaseCounter("failed logins");
  return attempt;
};

export const mapBoxAccessToken = config.mapBoxAccessToken;

export const stats = async (pwd) => {
  if (!auth(pwd)) return;
  let counters = getCounters();
  let res = [];
  for (let counter of counters) res.push(counter + ": " + getCounter(counter));
  return {
    type: "list",
    title: "stats. since server start.",
    entries: res,
  };
};
