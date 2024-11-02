import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parsePaginationDataFromObject } from "@/models/Pagination";
import {
  parseReportFromObject,
  parseReportsFromArray,
  Report,
} from "@/models/Report";
import {
  parseReportSectionQuestionsFromArray,
  ReportSectionQuestions,
} from "@/models/ReportSectionQuestion";
import { useAuthStore } from "@/store/authStore";
import { Items, OrderType } from "@/types/types";
import axiosInstance from "@/plugins/axios";

export const updateReport = async (data: any) => {
  let r: Report;
  try {
    r = await axiosInstance.post(`${apiEndpoints.reportUpdate}`, data).then((r) => {
      const d = extractAxiosData(r) || [];

      if (!d.success || false) {
        throw new Error(`HTTP error! status: Failed to update report`);
      }
      return parseReportFromObject(d.id);
    });
  } catch (error) {
    throw error;
  }
  return r;
};

export const getReports = async (
  page: number,
  itemsPerPage: number,
  orderBy: string,
  orderType: OrderType
) => {
  let r: Items;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isDonor
      ? apiEndpoints.reportsDonor
      : apiEndpoints.reportsApplicant;
    r = await axiosInstance
      .get(`${endpoint}/${page}/${orderBy}/${orderType}/${itemsPerPage}?`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return {
          paginationData: parsePaginationDataFromObject(d.info),
          items: parseReportsFromArray(d.response),
          status: d.success,
        };
      });
  } catch (error) {
    throw error;
  }
  return r;
};

export const getReport = async (id: string) => {
  let r: Report;
  try {
    r = await axiosInstance
      .get(`${apiEndpoints.reportGet}/${encodeURIComponent(id)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        if (!d.success || false) {
          throw new Error(`HTTP error! status: Failed to get report`);
        }
        return parseReportFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

export const getReportDefaultQuestions = async (id: string) => {
  let r: Report;
  try {
    r = await axiosInstance
      .get(`${apiEndpoints.reportGet}/${encodeURIComponent(id)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return parseReportFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

export const getReportQuestions = async (id: string) => {
  let r: ReportSectionQuestions;
  try {
    r = await axiosInstance
      .get(`${apiEndpoints.publicFiles}/${encodeURIComponent(id)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        if (!d.sections) {
          throw new Error(`HTTP error! status: Report sections missing`);
        }
        return parseReportSectionQuestionsFromArray(d.sections);
      });
  } catch (error) {
    throw error;
  }
  return r;
};
