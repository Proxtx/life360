export class Component {
  constructor(options) {
    this.options = options;
    this.disappearFunction = () => this.disappear();
    window.disappear
      ? window.disappear.push(this.disappearFunction)
      : (window.disappear = [this.disappearFunction]);

    setTimeout(() => {
      options.shadowDom.getElementById("transitionBox").style.animation =
        "flyIn var(--animationSpeed) forwards";
    }, window.disappear.length * 200);
  }
  disappear = () => {
    this.options.shadowDom.getElementById("transitionBox").style.animation =
      "flyOut var(--animationSpeed) forwards";
    setTimeout(
      () =>
        window.disappear.splice(
          window.disappear.indexOf(this.disappearFunction),
          1
        ),
      5000
    );
  };
}
