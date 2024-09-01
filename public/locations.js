import { handlers } from "../private/file/collect.js";
import { auth } from "./meta.js";
import { getTimespan } from "../private/file/file.js";
import config from "@proxtx/config";
import fs from "fs/promises";
import * as crypto from "crypto";

let privateKey = null;
try {
  privateKey = await fs.readFile("private-key.pem", "utf-8");
} catch {}

let publicKey = null;
try {
  publicKey = await fs.readFile("public-key.pem", "utf-8");
} catch {}

export const timespan = async (pwd) => {
  if (!auth(pwd)) return;
  return await getTimespan(config.locations);
};

export const getOverview = async (pwd) => {
  if (!auth(pwd)) return;
  return await handlers.overviewMap();
};

export const getLocationsInTimespan = async (pwd, users, start, end) => {
  if (!auth(pwd)) return;
  return await handlers.locationsInTimespan(users, start, end);
};

export const getLocationsInTimespanSignature = async (
  signatureString,
  users,
  start,
  end
) => {
  let signature = JSON.parse(signatureString);
  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(signature.data);
  if (!verify.verify(publicKey, signature.signature, "base64")) {
    return;
  }
  let timespan = JSON.parse(signature.data);
  if (
    timespan.start <= start &&
    timespan.start <= end &&
    timespan.end >= start &&
    timespan.end >= end
  ) {
    return await handlers.locationsInTimespan(users, start, end);
  }
};

export const signLocations = async (pwd, start, end) => {
  if (!auth(pwd)) return;
  if (!privateKey) return;
  const sign = crypto.createSign("RSA-SHA256");
  let data = JSON.stringify({ start, end });
  sign.update(data);
  return JSON.stringify({ data, signature: sign.sign(privateKey, "base64") });
};
