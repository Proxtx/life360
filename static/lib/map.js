import { locations, meta } from "./api.js";
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
  genPlaces(locationData).forEach((element) => element.addTo(map));
  genUsers(locationData).forEach((element) => {
    element.addTo(map);
    console.log(element.getElement());
  });
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

  console.log(users);
  return users;
};

const genUser = (location, uId) => {
  /*console.log([
    [location.latitude - 0.1, Number(location.latitude) + 0.1],
    [location.longitude - 0.1, Number(location.latitude) + 0.1],
  ]);*/
  /*let overlay = L.imageOverlay(users[uId].avatar, [
    [location.latitude - 0.001, location.longitude - 0.001],
    [Number(location.latitude) + 0.001, Number(location.longitude) + 0.001],
  ]);*/
  // 1) Convert LatLng into container pixel position.
  /*var originPoint = map.latLngToContainerPoint([
    location.latitude,
    location.longitude,
  ]);*/
  // 2) Add the image pixel dimensions.
  // Positive x to go right (East).
  // Negative y to go up (North).
  //var nextCornerPoint = originPoint.add({ x: 24, y: -24 });
  // 3) Convert back into LatLng.
  //var nextCornerLatLng = map.containerPointToLatLng(nextCornerPoint);
  /*var imageOverlay = L.imageOverlay(users[uId].avatar, [
    [location.latitude, location.longitude],
    nextCornerLatLng,
  ]).addTo(map);*/
  //console.log(overlay.getElement());
  //return overlay;

  /*let overlay = L.imageOverlay(users[uId].avatar, [
    [location.latitude - 0.001, location.longitude - 0.001],
    [Number(location.latitude) + 0.001, Number(location.longitude) + 0.001],
  ]);

  map.on("zoom", () => {
    let layerPoints = map.latLngToLayerPoint([location.latitude, location.longitude])
    let startLayerPoints = [layerPoints[0] - 20, layerPoints[1] - 20];
    let endLayerPoints = [layerPoints[0] + 20, layerPoints[1] + 20];
    let latLongStart = map.layerPointToLatLng(startLayerPoints);
    let latLongEnd = map.layerPointToLatLng(endLayerPoints);

    overlay.setLatLngs(latLon)
  })*/

  let marker = L.marker([location.latitude, location.longitude], {
    icon: L.icon({
      iconUrl: users[uId].avatar,
      iconSize: [40, 40],
    }),
  });

  marker.bindPopup("<h2>" + users[uId].name + "</h2>");

  return marker;
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
