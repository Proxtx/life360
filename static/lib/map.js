import { locations, meta } from "./api.js";
import users from "./users.js";

while (!window.L) {
  await new Promise((r) => setTimeout(r, 500));
}

const map = L.map("map").setView([0, 0], 13);

var mapBoxUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";

L.tileLayer(mapBoxUrl, {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a> Proxtx',
  maxZoom: 18,
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  accessToken: await meta.mapBoxAccessToken,
}).addTo(map);

const clearMap = () => {
  map.eachLayer((layer) => {
    if (mapBoxUrl != layer._url) {
      map.removeLayer(layer);
    }
  });
};

export const renderLocationData = (locationData) => {
  clearMap();
  let bounds = [];

  genPaths(locationData).forEach((element) => element.addTo(map));
  genPlaces(locationData).forEach((element) => element.addTo(map));
  genUsers(locationData).forEach((element) => {
    element.addTo(map);
    let html = element.getElement();
    html.style.borderRadius = "15px";
    html.style.border = "3px solid " + users[element.uId].color;

    bounds.push([element.location.latitude, element.location.longitude]);
  });

  if (bounds.length >= 1) map.flyToBounds(bounds, { duration: 2 });
};

const genPaths = (locations) => {
  let uIds = Object.keys(locations[Object.keys(locations)[0]]);
  let paths = [];
  for (let uId of uIds) {
    paths.push(genPath(locations, uId));
  }

  return paths;
};

const genPath = (locations, uId) => {
  let points = [];
  let times = Object.keys(locations).sort((a, b) => a - b);
  for (let i of times) {
    let location = locations[i][uId];
    points.push([location.latitude, location.longitude]);
  }

  return L.polyline(points, {
    color: users[uId].color,
  });
};

const genPlaces = (locations) => {
  let locs = {};

  for (let time in locations) {
    for (let user in locations[time]) {
      let location = locations[time][user];
      if (location.address && !locs[location.address])
        locs[location.address] = genLocationCircle(location);
    }
  }

  return Object.values(locs);
};

const genLocationCircle = (location) => {
  return L.circle([location.latitude, location.longitude], {
    color: "black",
    radius: 50,
  }).bindPopup("<h2>" + location.address + "</h2>");
};

const genUsers = (locations) => {
  let times = Object.keys(locations).sort((a, b) => a - b);
  let latestLocations = locations[times[times.length - 1]];
  let users = [];
  for (let user in latestLocations) {
    users.push(genUser(latestLocations[user], user));
  }

  return users;
};

const genUser = (location, uId) => {
  let marker = L.marker([location.latitude, location.longitude], {
    icon: L.icon({
      iconUrl: users[uId].avatar,
      iconSize: [40, 40],
    }),
  });

  marker.uId = uId;
  marker.bindPopup("<h2>" + users[uId].name + "</h2>");
  marker.location = location;

  return marker;
};
