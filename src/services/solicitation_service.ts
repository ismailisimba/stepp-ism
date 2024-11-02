import apiEndpoints from "@/constants/endpoints";
import { CustomException } from "@/helpers/errorHelper";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { objectToFormData } from "@/helpers/general";
import { parsePaginationDataFromObject } from "@/models/Pagination";
import {
  parseSolicitationFromObject,
  parseSolicitationsFromArray,
  Solicitation,
} from "@/models/Solicitation";
import { useAuthStore } from "@/store/authStore";
import { Items, OrderType } from "@/types/types";
import axios, { toFormData } from "axios";

const get = async (id: string) => {
  let r: any;
  try {
    r = await axios
      .get(`${apiEndpoints.solicitationsGet}/${encodeURIComponent(id)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return parseSolicitationFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const rankSol = async (solIds: string) => {
  let r: any;
  try {
    r = await axios
      .post(
        `${apiEndpoints.solicitationsRank}`,
        toFormData({
          solicitation_id: solIds,
          tableId: "application",
        })
      )
      .then((r: any) => {
        const d: any = extractAxiosData(r) || [];
        if (!d.success || false) {
          throw new Error(`HTTP error! status: Failed to rank`);
        }
        return parseSolicitationFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const shortlist = async (appIds: Array<string>) => {
  let r: any;
  try {
    let f = new FormData();
    f.append("tableId", "application");
    appIds.forEach((a) => {
      f.append("application_id", a);
    });
    r = await axios
      .post(`${apiEndpoints.solicitationsShortlist}`, f)
      .then((r: any) => {
        const d: any = extractAxiosData(r) || [];
        if (!d.success || false) {
          throw new Error(`HTTP error! status: Failed to shortlist`);
        }
        return parseSolicitationFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const award = async (appIds: Array<string>) => {
  let r: any;
  try {
    let f = new FormData();
    f.append("tableId", "application");
    appIds.forEach((a) => {
      f.append("application_id", a);
    });
    r = await axios
      .post(`${apiEndpoints.solicitationsAward}`, f)
      .then((r: any) => {
        const d: any = extractAxiosData(r) || [];
        if (!d.success || false) {
          throw new Error(`HTTP error! status: Failed to award`);
        }
        return parseSolicitationFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const getAll = async (
  page: number,
  itemsPerPage: number,
  orderBy: string,
  orderType: OrderType
) => {
  let r: Items;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isDonor
      ? apiEndpoints.solicitations
      : apiEndpoints.solicitationsApplicant;
    r = await axios
      .get(`${endpoint}/${page}/${orderBy}/${orderType}/${itemsPerPage}?`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return {
          paginationData: parsePaginationDataFromObject(d.info),
          items: parseSolicitationsFromArray(d.response),
          status: d.success,
        };
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const store = async (isUpdating: boolean, data: FormData) => {
  let res: Solicitation;
  try {
    // let payload = getPayload(data);
    res = await axios
      .post(
        isUpdating
          ? apiEndpoints.solicitationsUpdate
          : apiEndpoints.solicitationsStore,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((r) => {
        const d = extractAxiosData(r) || [];
        if (d.success) {
          return parseSolicitationFromObject(d.id);
        }
        throw CustomException("Unable to create solication", "failed");
      });
  } catch (error) {
    throw error;
  }
  return res;
};

const getPayload = (data: SolicitationFormFields) => {
  let payload = new FormData();
  payload.append("name_type", "STRING");
  payload.append("name", data.name);
  payload.append("start_date_type", "DATE");
  payload.append(
    "start_date",
    "" + data.start_date?.toISOString().substring(0, 10)
  );
  payload.append("end_date_type", "DATE");
  payload.append(
    "end_date",
    "" + data.end_date?.toISOString().substring(0, 10)
  );
  payload.append("description_type", "STRING");
  payload.append("description", data.description);
  payload.append("status_type", "STRING");
  payload.append("status", "draft");
  payload.append("locations_type", "STRING");
  data.locations?.forEach((loc) => {
    payload.append("locations", "" + loc);
  });
  payload.append("funding_per_project_usd_type", "INTEGER");
  payload.append("funding_per_project_usd", "" + data.funding_per_project_usd);
  payload.append("documents_type", "STRING");
  data.fileInput?.forEach((doc) => {
    payload.append("fileInput", doc);
  });
  payload.append("solicitation_questions_type", "STRING");
  if (data.solicitation_questions) {
    data.solicitation_questions?.forEach((q) => {
      payload.append("solicitation_questions", "" + q);
    });
  } else {
    payload.append("solicitation_questions", "to_be_filled_later");
  }
  payload.append("program_type", "STRING");
  payload.append("program", "Climate Change Program 1");
  payload.append("id_type", "STRING");
  payload.append("id", "" + data.id);
  payload.append("program_id_type", "STRING");
  payload.append("program_id", "" + data.program_id);
  return payload;
};

export { getAll, get, store, rankSol, shortlist, award };
