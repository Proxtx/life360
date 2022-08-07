export class Component {
  config = {
    start: 0,
    end: 100,
    limitStart: 0,
    limitEnd: 100,
    value: 50,
  };

  constructor(options) {
    this.document = options.shadowDom;
    this.elements = {
      bar: this.document.getElementById("bar"),
      selector: this.document.getElementById("selector"),
      wrap: this.document.getElementById("wrap"),
    };

    this.applyConfig();

    let mouseActive = false;

    this.elements.selector.addEventListener("mousedown", () => {
      mouseActive = true;
    });

    this.elements.selector.addEventListener("mouseup", () => {
      console.log("yes");
    });

    document.addEventListener("mouseup", () => {
      console.log(mouseActive);
      mouseActive = false;
    });
  }

  attributeChangedCallback(attribute, oldValue, newValue) {}

  applyConfig() {
    let wrapBounds = this.elements.wrap.getBoundingClientRect();
    let unit = wrapBounds.width / (this.config.end - this.config.start);
    this.elements.selector.style.left = unit * this.config.value + "px";
    this.elements.bar.style.width =
      unit * (this.config.limitEnd - this.config.limitStart) + "px";
    this.elements.bar.style.left = unit * this.config.limitStart + "px";
  }
}
