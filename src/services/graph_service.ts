import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parseApplicationGraphDataFromObject } from "@/models/Application";
import { parseProgramGraphDataFromObject } from "@/models/Program";
import { parseProjectGraphDataFromObject } from "@/models/Project";
import { parseReportGraphDataFromObject } from "@/models/Report";
import { parseSolicitationGraphDataFromObject } from "@/models/Solicitation";
import { useAuthStore } from "@/store/authStore";
import { KeyValPair } from "@/types/KeyValPair";
import axiosInstance from "@/plugins/axios";

export const homeGraphsData = async () => {
  let res;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isApplicant
      ? apiEndpoints.homeGraphsApplicant
      : apiEndpoints.homeGraphsDonor;
    res = await axiosInstance.get(endpoint).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const data = extractAxiosData(r);
      return {
        program: parseProgramGraphDataFromObject(data.program),
        solicitation: parseSolicitationGraphDataFromObject(data.solicitation),
        project: parseProjectGraphDataFromObject(data.project),
        application: parseApplicationGraphDataFromObject(data.application),
        report: parseReportGraphDataFromObject(data.reports),
      };
    });
  } catch (error) {
    throw error;
  }
  return res;
};

export const programGraphsData = async () => {
  let res: KeyValPair;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isApplicant
      ? apiEndpoints.programGraphsApplicant
      : apiEndpoints.programGraphsDonor;
    res = await axiosInstance.get(endpoint).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }

      const data = extractAxiosData(r);
      return data;
    });
  } catch (error) {
    throw error;
  }
  return res;
};

export const solicitationGraphsData = async () => {
  let res: KeyValPair;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isApplicant
      ? apiEndpoints.solicitationGraphsApplicant
      : apiEndpoints.solicitationGraphsDonor;
    res = await axiosInstance.get(endpoint).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const data = extractAxiosData(r);
      return data;
    });
  } catch (error) {
    throw error;
  }
  return res;
};

export const projectGraphsData = async () => {
  let res: KeyValPair;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isApplicant
      ? apiEndpoints.projectGraphsApplicant
      : apiEndpoints.projectGraphsDonor;
    res = await axiosInstance.get(endpoint).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const data = extractAxiosData(r);
      return data;
    });
  } catch (error) {
    throw error;
  }
  return res;
};
