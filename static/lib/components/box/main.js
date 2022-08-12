export class Component {
  constructor(options) {
    this.document = options.shadowDom;

    this.elements = {
      heading: this.document.getElementById("heading"),
      content: this.document.getElementById("content"),
      hidden: this.document.getElementById("hidden"),
      list: this.document.getElementById("list"),
      graph: this.document.getElementById("graph"),
    };
  }

  setData(data) {
    this.data = data;
    this.applyData();
  }

  async applyData() {
    for (let child of this.elements.content.children) {
      this.elements.hidden.appendChild(child);
    }

    this.elements.heading.innerText = this.data.title;
    await this.elements.content.appendChild(this.elements[this.data.type]);
    this.contentRenderers[this.data.type]();
  }

  contentRenderers = {
    list: () => {
      this.elements.list.innerHTML = "";
      for (let entry of this.data.entries) {
        let text = document.createElement("a");
        text.innerText = entry;
        this.elements.list.appendChild(text);
      }
    },

    graph: async () => {
      let rect = this.elements.graph.getBoundingClientRect();
      this.elements.graph.width = rect.width;
      this.elements.graph.height = rect.height;
      drawDataOnCanvas(this.elements.graph, this.data);
    },
  };
}

const drawDataOnCanvas = (canvas, data) => {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = data.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = data.color;
  for (let pointIndex in data.dataPoints) {
    let point = data.dataPoints[pointIndex];
    ctx.fillRect(
      pointIndex * (canvas.width / data.dataPoints.length),
      canvas.height,
      canvas.width / data.dataPoints.length,
      (canvas.height / data.max) * -point
    );
  }
};
