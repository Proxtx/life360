export class Component {
  constructor(options) {
    let disappearFunction = () => {
      options.shadowDom.getElementById("transitionBox").style.animation =
        "flyOut var(--animationSpeed) forwards";
    };
    window.disappear
      ? window.disappear.push(disappearFunction)
      : (window.disappear = [disappearFunction]);
  }
}
