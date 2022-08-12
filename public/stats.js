import { jobStatus, createJob } from "../private/stats/jobManagement.js";
import { auth } from "./meta.js";

export const createStatsJob = (pwd, user, start, end) => {
  if (!auth(pwd)) return;
  return createJob(user, start, end);
};

export const statsJobStatus = (pwd, id) => {
  if (!auth(pwd)) return;
  return jobStatus(id);
};
