import { handlers } from "../private/file/collect.js";
import { auth } from "./meta.js";

export const getUsers = async (pwd) => {
  return await handlers.users();
};

export const getUserPlaces = async (pwd) => {
  if (!auth(pwd)) return;
  return await handlers.userPlaces();
};
