import { Stats } from "./stats.js";

let jobs = {};

export const createJob = (user, start, end) => {
  console.log("Job created");
  let id = Math.floor(Math.random() * 100000000);
  jobs[id] = new Stats(user, start, end);
  return id;
};

export const jobStatus = (id) => {
  let job = jobs[id];
  if (!job) return;

  if (job.done) {
    console.log("jobDone");
    jobs[job] = null;
  }

  return { status: job.status, result: job.done ? job.result : null };
};
