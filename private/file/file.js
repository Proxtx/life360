import fs from "fs/promises";

export const loadFile = async (folder, file) => {
  return {
    success: true,
    file: await fs.readFile(folder + file, "utf-8"),
  };
};

export const getTimespan = async (folder) => {
  let dates = await getFilesInOrder(folder);
  let start = Number(dates[0]);
  let load = await loadFile(folder, dates[dates.length - 1] + ".json");
  let times = getTimesInFileInOrder(load.file);
  let end = Number(times[times.length - 1]);
  return { success: true, start, end };
};

export const getDataInTimespan = async (folder, start, end) => {
  let files = await getFilesInOrder(folder);
  let lookingForEnd = false;
  let filesToLoad = [];
  for (let i of files) {
    if (!lookingForEnd) {
      if (i > start) {
        lookingForEnd = true;
      } else {
        filesToLoad = [];
        filesToLoad.push(i);
        continue;
      }
    }
    if (i > end) {
      break;
    }
    filesToLoad.push(i);
  }

  let resultObject = {};
  let loadedFiles = [];

  for (let i in filesToLoad) {
    let load = await loadFile(folder, filesToLoad[i] + ".json");
    loadedFiles[i] = JSON.parse(load.file);
  }

  let locationData = {};
  for (let i of loadedFiles) {
    locationData = { ...locationData, ...i };
  }

  for (let i of getTimesInFileInOrder(locationData)) {
    if (i > start) resultObject[i] = locationData[i];
    if (i > end) {
      break;
    }
  }

  if (Object.keys(resultObject).length == 0) {
    let timesInStartData = getTimesInFileInOrder(locationData);
    resultObject[timesInStartData[timesInStartData.length - 1]] =
      locationData[timesInStartData[timesInStartData.length - 1]];
  }

  return { success: true, result: resultObject };
};

export const getFilesInOrder = async (folder) => {
  let dates = [];
  let files = await fs.readdir(folder);
  files.forEach((file) => {
    if (file.split(".txt").length > 1) return;
    dates.push(file.split(".json")[0]);
  });
  dates.sort((a, b) => {
    return a - b;
  });
  return dates;
};

export const getTimesInFileInOrder = (raw) => {
  let file = typeof raw == "string" ? JSON.parse(raw) : raw;
  let times = Object.keys(file);
  times.sort((a, b) => {
    return a - b;
  });
  return times;
};
