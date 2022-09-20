import { getDataInTimespan, getTimespan } from "./file.js";
import config from "@proxtx/config";
import { increaseCounter } from "../stats.js";

/**
 * Main Data access point
 * @param {String} type "locations" or "data"
 * @param {Number} start start in ms
 * @param {Number} end "end in ms"
 * @param {F} filter filter function
 */
export const data = async (type, start, end, filter = (d) => d) => {
  increaseCounter("api calls");
  let folder = config[type];
  if (!end) {
    end = (await getTimespan(folder)).end;
    start = end - start;
  }
  let result = (await getDataInTimespan(folder, start, end)).result;
  for (let i in result) {
    result[i] = filter(result[i], i);
  }

  return result;
};

export const handlers = {
  users: async () => {
    let users = await data("data", 1, null, (value) => {
      for (let uId in value) {
        value[uId] = {
          avatar: value[uId].avatar,
          name: value[uId].firstName,
        };
      }

      return value;
    });
    return users[Object.keys(users)[0]];
  },

  userIds: async () => {
    return Object.keys(await handlers.users());
  },

  locationsInTimespan: async (users, start, end) => {
    return await data("locations", start, end, (value) => {
      for (let k in value) {
        if (!users.includes(k)) delete value[k];
      }
      return value;
    });
  },

  overviewMap: async () => {
    let uIds = await handlers.userIds();
    let locs = await handlers.locationsInTimespan(uIds, handlers.hour * 2);

    return locs;
  },

  userPlaces: async () => {
    let uIds = await handlers.userIds();
    let locs = await handlers.locationsInTimespan(uIds, 1);
    locs = locs[Object.keys(locs)[0]];
    let users = await handlers.users();

    let places = {};
    for (let uId in locs) {
      places[users[uId].name] = locs[uId].address;
    }

    return places;
  },

  week: 1.6534e-9,
  hour: 3.6e6,
};
