import { getDataInTimespan, getTimespan } from "./file.js";
import config from "@proxtx/config";

/**
 * Main Data access point
 * @param {String} type "locations" or "data"
 * @param {Number} start start in ms
 * @param {Number} end "end in ms"
 * @param {F} filter filter function
 */
export const data = async (type, start, end, filter = (d) => d) => {
  let folder = config[type];
  if (!end) {
    end = (await getTimespan(folder)).end;
    start = end - start;
  }
  let result = (await getDataInTimespan(folder, start, end)).result;
  result.filter(filter);
};

//export const
