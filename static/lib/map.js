while (!window.L) {
  await new Promise((r) => setTimeout(r, 500));
}

const mapElem = document.getElementById("map");
const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a> Proxtx',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoicHJveHR4IiwiYSI6ImNsNXF5dm9mZTBpdTgzanA4bXAxZGxqajIifQ.ardzxffHpMXyhvSjlC-gAw",
  }
).addTo(map);
