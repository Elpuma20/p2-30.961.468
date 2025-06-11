import { getCountryFromIp } from "./geolocationService";

const testIps = ["8.8.8.8", "1.1.1.1", "invalid_ip"];

testIps.forEach(async (ip) => {
  const country = await getCountryFromIp(ip);
  console.log(`IP: ${ip} - País: ${country}`);
});