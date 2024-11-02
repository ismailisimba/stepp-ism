import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parseApplicationsFromArray } from "@/models/Application";
import { parseProgramsFromArray } from "@/models/Program";
import { parseProjectsFromArray } from "@/models/Project";
import { parseReportsFromArray } from "@/models/Report";
import { parseSolicitationsFromArray } from "@/models/Solicitation";
import { useAuthStore } from "@/store/authStore";
import { SearchFieldData } from "@/types/types";
import axios from "axios";

export const search = async (data: SearchFieldData) => {
  let r;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isDonor
      ? apiEndpoints.searchDonor
      : apiEndpoints.searchApplicant;

    const p = new FormData();
    p.append("inputs", JSON.stringify(data));
    r = await axios.post(endpoint, p).then((r) => {
      const d = extractAxiosData(r) || [];
      switch (data.tableId) {
        case "program":
          return parseProgramsFromArray(d);
        case "solicitation":
          return parseSolicitationsFromArray(d);
        case "application":
          return parseApplicationsFromArray(d);
        case "project":
          return parseProjectsFromArray(d);
        case "reports":
          return parseReportsFromArray(d);
        default:
          return d;
      }
    });
  } catch (error) {
    throw error;
  }
  return r;
};
