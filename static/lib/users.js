import { data } from "./api.js";

let users = await data.getUsers(cookie.pwd);
for (let i in users) {
  users[i].color = "#" + Math.floor(Math.random() * 16777215).toString(16);
}
export default users;
