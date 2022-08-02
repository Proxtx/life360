import { meta } from "./api.js";
import users from "./users.js";

while (!window.L) {
  await new Promise((r) => setTimeout(r, 500));
}

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
    accessToken: await meta.mapBoxAccessToken,
  }
).addTo(map);

export const renderLocationData = (locationData) => {
  genPath(locationData, "92952756-c1a5-4a1d-9165-a95da92d2877").addTo(map);
};

const genPath = (locations, uId) => {
  let points = [];
  let times = Object.keys(locations).sort((a, b) => a - b);
  for (let i of times) {
    let location = locations[i][uId];
    points.push([location.latitude, location.longitude]);
  }

  return L.polyline(points, {
    color: "black",
  });
};

const oldGenPath = (locations, user, userAvatar) => {
  let points = [];
  let times = Object.keys(locations);
  let prevLat = 0;
  let prevLong = 0;
  let addresses = {};
  let addrCircles = [];
  for (let i of times) {
    try {
      c++;
      let latitude = locations[i][user].latitude;
      let longitude = locations[i][user].longitude;

      if (
        locations[i][user].address &&
        !addresses[locations[i][user].address]
      ) {
        addrCircles.push(
          L.circle([latitude, longitude], {
            color: "black",
            radius: 50,
          }).bindPopup(
            "<h2>" +
              locations[i][user].address +
              "</h2>" +
              '<button class="button" onclick="window.displayInfo(' +
              i +
              ')">More Info</button><div></div>'
          )
        );
        addresses[locations[i][user].address] = true;
      }

      points.push([latitude, longitude]);
      prevLat = latitude;
      prevLong = longitude;
    } catch (e) {}
  }
  map.flyTo([prevLat, prevLong], 15);
  addrCircles.push(
    L.circle([prevLat, prevLong], {
      color: "white",
      radius: 10,
    }).bindPopup("Current Position")
  );
  return [
    L.polyline(points, {
      color: "black",
    }),
  ].concat(addrCircles);
};
