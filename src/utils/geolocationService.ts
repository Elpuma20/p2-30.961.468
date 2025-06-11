import axios from "axios";

const IPAPI_URL = "https://ipapi.co";

export const getCountryFromIp = async (ip: string): Promise<string> => {
  if (!ip) return "IP no disponible";
  try {
    const response = await axios.get(`${IPAPI_URL}/${ip}/json/`);
    return response.data.country_name || "Desconocido";
  } catch (error) {
    console.error("Error obteniendo país desde la IP:", error);
    return "Desconocido";
  }
};

