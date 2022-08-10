export class Component {
  config = {
    start: 0,
    end: 100,
    limitStart: 0,
    limitEnd: 100,
    value: 50,
  };

  change;

  dragActive = false;

  constructor(options) {
    this.document = options.shadowDom;
    this.elements = {
      bar: this.document.getElementById("bar"),
      selector: this.document.getElementById("selector"),
      wrap: this.document.getElementById("wrap"),
    };

    this.applyConfig();

    this.elements.selector.addEventListener("touchstart", (e) => {
      this.dragStart(e.touches[0].clientX, e.touches[0].clientY);
    });

    document.addEventListener("touchmove", (e) => {
      this.dragMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    });

    document.addEventListener("touchend", (e) => {
      this.dragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    });
  }

  applyConfig() {
    if (this.config.value < this.config.limitStart)
      this.config.value = this.config.limitStart;
    if (this.config.value > this.config.limitEnd)
      this.config.value = this.config.limitEnd;
    let wrapBounds = this.elements.wrap.getBoundingClientRect();
    let unit = wrapBounds.width / (this.config.end - this.config.start);
    this.elements.selector.style.left = unit * this.config.value + "px";
    this.elements.bar.style.width =
      unit * (this.config.limitEnd - this.config.limitStart) + "px";
    this.elements.bar.style.left =
      unit * (this.config.limitStart - this.config.start) + "px";
    this.unit = unit;
  }

  dragStart(x, y) {
    this.dragActive = true;
  }

  dragMove(x, y) {
    if (!this.dragActive) return;
    let boundingRect = this.elements.wrap.getBoundingClientRect();
    x = x - boundingRect.x;
    y = y - boundingRect.y;
    this.config.value = Math.round(x / this.unit);
    this.applyConfig();
    if (this.change) this.change();
  }

  dragEnd(x, y) {
    this.dragMove(x, y);
    this.dragActive = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    newValue = Number(newValue);
    switch (name) {
      case "start":
      case "end":
      case "value":
        this.config[name] = newValue;
        break;
      case "limitstart":
        this.config["limitStart"] = newValue;
        break;
      case "limitend":
        this.config["limitEnd"] = newValue;
        break;
    }
    this.applyConfig();
  }
}
