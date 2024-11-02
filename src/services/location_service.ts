import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import axios from "axios";

const getCountries = async () => {
  let countries;
  try {
    await axios.get(apiEndpoints.locations).then((r) => {
      const d = extractAxiosData(r) || [];
      countries = d.locations.countries || [];
    });
  } catch (error) {
    throw error;
  }
  return countries;
};

export default getCountries;
