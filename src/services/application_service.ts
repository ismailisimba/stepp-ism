import apiEndpoints from "@/constants/endpoints";
import { CustomException } from "@/helpers/errorHelper";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import {
  Application,
  parseApplicationFromObject,
  parseApplicationsFromArray,
} from "@/models/Application";
import { ApplicationInfo } from "@/models/ApplicationInfo";
import { parsePaginationDataFromObject } from "@/models/Pagination";
import { SolicitationQuestionSections } from "@/models/SolicitationQuestionSection";
import { useAuthStore } from "@/store/authStore";
import { Items, OrderType } from "@/types/types";
import axios from "axios";

const submitQuestionMarks = async (solId: string, data: ApplicationInfo) => {
  const payload = marksPayload(data);
  let res: boolean;
  res = await axios
    .post(
      `${apiEndpoints.applicationSaveMarks}/${encodeURIComponent(
        solId
      )}/save-marks-submit`,
      payload
    )
    .then((r) => {
      const d = extractAxiosData(r) || [];
      if (d.hasOwnProperty("error")) {
        throw CustomException(`HTTP error! status: ${d.error}`, "none");
      }
      return true;
    });
  return res;
};

const saveQuestionMarks = async (solId: string, data: ApplicationInfo) => {
  const payload = marksPayload(data);
  let res: boolean;
  res = await axios
    .post(
      `${apiEndpoints.applicationSaveMarks}/${encodeURIComponent(
        solId
      )}/save-answers-marks`,
      payload
    )
    .then((r) => {
      const d = extractAxiosData(r) || [];
      if (d.hasOwnProperty("error")) {
        throw CustomException(`HTTP error! status: ${d.error}`, "none");
      }
      return true;
    });
  return res;
};

const marksPayload = (data: ApplicationInfo) => {
  let sections = JSON.stringify({
    ...data,
  });
  let payload = new FormData();
  payload.append("inputs", sections);
  return payload;
};

const getApplications = async (
  page: number,
  itemsPerPage: number,
  orderBy: string,
  orderType: OrderType
) => {
  let r: Items;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isDonor
      ? apiEndpoints.applicationsDonor
      : apiEndpoints.applicationsApplicant;
    r = await axios
      .get(`${endpoint}/${page}/${orderBy}/${orderType}/${itemsPerPage}?`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return {
          paginationData: parsePaginationDataFromObject(d.info),
          items: parseApplicationsFromArray(d.response),
          status: d.success,
        };
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const getApplication = async (id: string) => {
  let r: Application;
  try {
    r = await axios
      .get(`${apiEndpoints.applicationGet}/${encodeURIComponent(id)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return parseApplicationFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

export { getApplications, saveQuestionMarks, getApplication, submitQuestionMarks};
