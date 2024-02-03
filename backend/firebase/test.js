import { getZones } from "./query.js";

const zones = await getZones();
console.log(zones);