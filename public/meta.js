import config from "@proxtx/config";

export const auth = (pwd) => {
  return config.pwd == pwd;
};

export const mapBoxAccessToken = config.mapBoxAccessToken;
