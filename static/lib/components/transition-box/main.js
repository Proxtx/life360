export class Component {
  constructor(options) {
    this.options = options;
    window.disappear
      ? window.disappear.push(() => this.disappear())
      : (window.disappear = [() => this.disappear()]);

    setTimeout(() => {
      options.shadowDom.getElementById("transitionBox").style.animation =
        "flyIn var(--animationSpeed) forwards";
    }, window.disappear.length * 200);
  }
  disappear = () => {
    this.options.shadowDom.getElementById("transitionBox").style.animation =
      "flyOut var(--animationSpeed) forwards";
  };
}
