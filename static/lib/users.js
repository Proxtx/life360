import { data } from "./api.js";

let users = await data.getUsers(cookie.pwd);
for (let i in users) {
  users[i].color = "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
}
export default users;
