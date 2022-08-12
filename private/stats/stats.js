import { data } from "../file/collect.js";

export class Stats {
  status = "Starting";
  done = false;
  result = [];
  defaultCollectionMethods = [
    "distance",
    "members",
    "places",
    "battery",
    "dataPoints",
  ];

  constructor(user, start, end) {
    this.user = user;
    this.start = start;
    this.end = end;

    this.collectStats();
  }

  async collectStats() {
    this.status = "collecting locations";
    this.locations = await data("locations", this.start, this.end);
    this.locationTimes = Object.keys(this.locations).sort((a, b) => a - b);
    this.status = "collecting data";
    this.data = await data("data", this.start, this.end);
    this.dataTimes = Object.keys(this.data).sort((a, b) => a - b);
    for (let method of this.defaultCollectionMethods) {
      this.status = "collecting " + method;

      let tempRes;
      try {
        tempRes = this.collectors[method]();
      } catch (e) {
        console.log(
          "A collector threw and error while collecting for this query:",
          this.user,
          this.start,
          this.end,
          "\nError:",
          e
        );
        tempRes = null;
      }
      tempRes && this.result.push(tempRes);
    }

    this.done = true;
    this.status = "transmitting data";
  }

  collectors = {
    distance: () => {
      let lastLocation;
      let finalDistance = 0;
      for (let time of this.locationTimes) {
        let userLocation = this.locations[time][this.user];
        if (!lastLocation) {
          lastLocation = userLocation;
        }

        let distance = calcCrow(
          userLocation.latitude,
          userLocation.longitude,
          lastLocation.latitude,
          lastLocation.longitude
        );
        finalDistance += distance;

        lastLocation = userLocation;
      }

      return {
        type: "list",
        title: "distance traveled.",
        entries: [Math.floor(finalDistance) + "km"],
      };
    },

    members: () => {
      let members = {};
      for (let time of this.locationTimes) {
        let location = this.locations[time];
        let userLocation = location[this.user];
        for (let uId in location) {
          if (!members[uId]) members[uId] = 0;
          let memberLocation = location[uId];
          members[uId] += calcCrow(
            userLocation.latitude,
            userLocation.longitude,
            memberLocation.latitude,
            memberLocation.longitude
          );
        }
      }

      let membersArr = [];

      for (const data of Object.entries(members)) {
        membersArr.push(data);
      }

      membersArr.sort((a, b) => {
        return a[1] - b[1];
      });

      let latestData = this.data[this.dataTimes[this.dataTimes.length - 1]];

      membersArr = membersArr.map((v) => {
        return latestData[v[0]].firstName;
      });

      return {
        type: "list",
        title: "closest members.",
        entries: membersArr,
      };
    },

    places: () => {
      let places = {};
      for (let time of this.locationTimes) {
        let userLocation = this.locations[time][this.user];
        if (userLocation.address)
          places[userLocation.address]
            ? places[userLocation.address]++
            : (places[userLocation.address] = 0);
      }

      let placesArr = [];
      for (let data of Object.entries(places)) {
        placesArr.push(data);
      }

      placesArr.sort((a, b) => a[1] - b[1]);

      placesArr = placesArr.map((value) => value[0]);

      return {
        type: "list",
        title: "most time spent.",
        entries: placesArr,
      };
    },

    battery: () => {
      let batteryArray = [];
      for (let time of this.dataTimes) {
        batteryArray.push(this.data[time][this.user].location.battery);
      }

      return {
        type: "graph",
        title: "battery.",
        dataPoints: batteryArray,
        max: 100,
        color: "#65cf80",
        background: "transparent",
      };
    },

    dataPoints: () => {
      return {
        type: "list",
        title: "data points.",
        entries: [
          this.locationTimes.length + " Locations",
          this.dataTimes.length + " Full data",
        ],
      };
    },
  };
}

const calcCrow = (lat1, lon1, lat2, lon2) => {
  let R = 6371;
  let dLat = toRad(lat2 - lat1);
  let dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};

const toRad = (Value) => {
  return (Value * Math.PI) / 180;
};
