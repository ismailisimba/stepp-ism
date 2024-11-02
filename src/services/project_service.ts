import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parsePaginationDataFromObject } from "@/models/Pagination";
import {
  parseProjectAnswersFromObject,
  parseProjectFromObject,
  parseProjectsFromArray,
  Project,
} from "@/models/Project";
import { useAuthStore } from "@/store/authStore";
import { Items, OrderType } from "@/types/types";
import axios from "axios";

const getProjects = async (
  page: number,
  itemsPerPage: number,
  orderBy: string,
  orderType: OrderType
) => {
  let r: Items;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isDonor
      ? apiEndpoints.projectsDonor
      : apiEndpoints.projectsApplicant;
    r = await axios
      .get(`${endpoint}/${page}/${orderBy}/${orderType}/${itemsPerPage}?`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return {
          paginationData: parsePaginationDataFromObject(d.info),
          items: parseProjectsFromArray(d.response),
          status: d.success,
        };
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const getProject = async (id: string) => {
  let r: Project;
  try {
    r = await axios
      .get(`${apiEndpoints.projectGet}/${encodeURIComponent(id)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return parseProjectFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

export const getProjectAnswers = async (url: string) => {
  let r: Project;
  try {
    r = await axios
      .get(`${apiEndpoints.publicFiles}/${encodeURIComponent(url)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return parseProjectAnswersFromObject(d);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

export const storeProject = async (isUpdating: boolean, data: any) => {
  let r: Project;
  try {
    r = await axios
      .post(
        isUpdating ? apiEndpoints.projectUpdate : apiEndpoints.projectAdd,
        data
      )
      .then((r) => {
        const d = extractAxiosData(r) || [];
        if (d["res"]) {
          if (!d["res"].success) {
            throw new Error(`HTTP error!`);
          }
          return parseProjectFromObject(d["res"].id);
        }

        if (d["success"]) {
          if (!d["success"]) {
            throw new Error(`HTTP error!`);
          }
          return parseProjectFromObject(d["id"]);
        }
        throw new Error(`HTTP error!`);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

export { getProjects, getProject };
