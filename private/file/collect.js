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
  for (let i in result) {
    result[i] = filter(result[i], i);
  }

  return result;
};

export const handlers = {
  users: async () => {
    let users = await data("data", 1, null, (value) => {
      let res = [];
      for (let uId in value) {
        res.push({
          avatar: value[uId].avatar,
          name: value[uId].firstName,
          uId,
        });
      }

      return res;
    });
    return users[Object.keys(users)[0]];
  },

  userIds: async () => {
    let res = await handlers.users();
    let uIds = [];
    res.forEach((element) => {
      uIds.push(element.uId);
    });

    return uIds;
  },

  locationsInTimespan: async (users, start, end) => {
    return await data("locations", start, end, (value) => {
      for (let k in value) {
        if (!users.includes(k)) delete value[k];
      }
    });
  },

  overviewMap: async () => {},

  week: 1.6534e-9,
};
