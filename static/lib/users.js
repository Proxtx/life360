import { data } from "./api.js";

window.usersLoading && (await new Promise((r) => window.usersLoading.push(r)));

let users;

if (window.users) {
  users = window.users;
} else {
  window.usersLoading = [];
  users = window.users ? window.users : await data.getUsers(cookie.pwd);
  for (let i in users) {
    users[i].color = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
  }

  window.usersLoading.forEach((element) => {
    element();
  });
  window.usersLoading = null;
}

window.users = users;
export default users;
