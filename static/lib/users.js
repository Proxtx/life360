import { data } from "./api.js";

const users = await data.getUsers(cookie.pwd);
export default users;
