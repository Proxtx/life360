export class Component {
  elements;
  activeConfig;

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
    };

    this.activeConfig = {
      smallBox: [this.elements.back],
      bigWrap: this.elements.textWrap,
    };

    this.applyConfig();
    this.updateConfig({
      smallBox: [this.elements.back, this.elements.time],
      bigWrap: this.elements.textWrap,
    });
  }

  applyConfig() {
    for (let child of this.elements.smallWrap.children)
      this.elements.itemHolder.appendChild(child);

    for (let child of this.elements.bigWrap.children)
      this.elements.itemHolder.appendChild(child);

    for (let child of this.activeConfig.smallBox) {
      this.elements.smallWrap.appendChild(child);
    }

    this.elements.bigWrap.appendChild(this.activeConfig.bigWrap);
  }

  async updateConfig(newConfig) {
    await this.changeOpacity(0);
    this.activeConfig = newConfig;
    this.applyConfig();
    await this.changeOpacity(1);
  }

  async changeOpacity(opacity, time = 200) {
    await new Promise((r) => setTimeout(r, time));

    for (let child of this.elements.smallWrap.children) {
      child.style.opacity = opacity;
      await new Promise((r) => setTimeout(r, time));
    }

    this.elements.bigWrap.style.opacity = opacity;
  }
}
