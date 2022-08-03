import { link } from "../../link.js";
import users from "../../users.js";

export class Component {
  elements;
  activeConfig;
  activeUsers = [];
  callback;

  constructor(options) {
    this.document = options.shadowDom;
    this.elements = {
      smallWrap: this.document.getElementById("smallWrap"),
      back: this.document.getElementById("back"),
      time: this.document.getElementById("time"),
      bigWrap: this.document.getElementById("bigWrap"),
      textWrap: this.document.getElementById("textWrap"),
      title: this.document.getElementById("title"),
      description: this.document.getElementById("description"),
      itemHolder: this.document.getElementById("itemHolder"),
      timeSelect: this.document.getElementById("timeSelect"),
      users: this.document.getElementById("users"),
      timeSelectWrap: this.document.getElementById("timeSelectWrap"),
    };

    window.headComponent = this;

    this.elements.back.addEventListener("click", () => {
      if (this.mode == "timeSelect")
        return this.changeMode(this.usersMulti ? "usersMulti" : "users");
      link("../overview");
    });

    this.elements.time.addEventListener("click", () => {
      this.changeMode("timeSelect");
    });

    this.createUsers();
  }

  applyConfig() {
    while (this.elements.smallWrap.children.length > 0)
      for (let child of this.elements.smallWrap.children)
        this.elements.itemHolder.appendChild(child);

    while (this.elements.bigWrap.children.length > 0)
      for (let child of this.elements.bigWrap.children)
        this.elements.itemHolder.appendChild(child);

    for (let child of this.activeConfig.smallBox) {
      this.elements.smallWrap.appendChild(child);
    }

    this.elements.bigWrap.appendChild(this.activeConfig.bigWrap);
  }

  async updateConfig(newConfig) {
    await this.disappear();
    this.activeConfig = newConfig;
    this.applyConfig();
    await this.appear();
  }

  async appear() {
    await this.changeOpacity(1);
  }

  async disappear() {
    await this.changeOpacity(0);
  }

  async changeOpacity(opacity, time = 200) {
    await new Promise((r) => setTimeout(r, time));
    for (let child of this.elements.smallWrap.children) {
      child.style.opacity = opacity;
      await new Promise((r) => setTimeout(r, time));
    }

    this.elements.bigWrap.style.opacity = opacity;
    await new Promise((r) => setTimeout(r, time * 2));
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    switch (attribute) {
      case "title":
        this.elements.title.innerText = newValue;
        break;
      case "description":
        this.elements.description.innerText = newValue;
        break;
      case "mode":
        this.changeMode(newValue);
        break;
    }
  }

  async changeMode(mode) {
    this.mode = mode;
    if (mode != "timeSelect") this.usersMulti = mode == "usersMulti";

    switch (mode) {
      case "normal":
        this.changeTimeSelectVisibility(false);
        await this.updateConfig({
          smallBox: [this.elements.back],
          bigWrap: this.elements.textWrap,
        });
        break;
      case "usersMulti":
      case "users":
        this.changeTimeSelectVisibility(false);
        await this.updateConfig({
          smallBox: [this.elements.back, this.elements.time],
          bigWrap: this.elements.users,
        });
        break;
      case "timeSelect":
        this.changeTimeSelectVisibility(true);
        await this.updateConfig({
          smallBox: [this.elements.back],
          bigWrap: this.elements.timeSelect,
        });
        break;
    }

    this.change();
  }

  changeTimeSelectVisibility(visible) {
    if (visible)
      this.elements.timeSelectWrap.className =
        "timeSelectWrap timeSelectExtended";
    else this.elements.timeSelectWrap.className = "timeSelectWrap";
  }

  createUsers() {
    for (let i in users) this.appendUser(i);
  }

  appendUser(uId) {
    let img = document.createElement("img");
    img.src = users[uId].avatar;
    img.className = "user";
    this.elements.users.appendChild(img);

    img.addEventListener("click", () => {
      let active = this.activeUsers.includes(uId);
      if (active) {
        img.style.border = "0px solid " + users[uId].color;
        this.activeUsers.splice(this.activeUsers.indexOf(uId), 1);
      } else {
        this.activeUsers.push(uId);
        img.style.border = "5px solid " + users[uId].color;
      }

      this.change();
    });
  }

  change() {
    this.callback && this.callback(this);
  }
}
