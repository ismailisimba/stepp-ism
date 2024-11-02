import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parsePaginationDataFromObject } from "@/models/Pagination";
import {
  parseProgramFromObject,
  parseProgramsFromArray,
  Program,
} from "@/models/Program";
import {
  Solicitation,
  parseSolicitationFromObject,
} from "@/models/Solicitation";
import { Items, OrderType } from "@/types/types";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { objectToFormData } from "@/helpers/general";

const solicitations = async (ids: Array<string>) => {
  let solicitations: (Solicitation | null)[];
  try {
    const requests = ids.map((id) =>
      axios.get(`${apiEndpoints.solicitationsGet}/${encodeURIComponent(id)}`)
    );
    const res = await axios.all(requests);
    solicitations = res
      .map((r) => {
        const d = extractAxiosData(r) || [];
        if (d.response[0]) return parseSolicitationFromObject(d.response[0]);
        return null;
      })
      .filter((d) => d !== null);
  } catch (error) {
    throw error;
  }
  return solicitations;
};

const show = async (id: string) => {
  let r: Program;
  try {
    r = await axios
      .get(`${apiEndpoints.programGet}/${encodeURIComponent(id)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return parseProgramFromObject(d.response[0]);
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const get = async (
  page: number,
  itemsPerPage: number,
  orderBy: string,
  orderType: OrderType
) => {
  let r: Items;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isApplicant
      ? apiEndpoints.programsApplicant
      : apiEndpoints.programs;
    r = await axios
      .get(`${endpoint}/${page}/${orderBy}/${orderType}/${itemsPerPage}?`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return {
          paginationData: parsePaginationDataFromObject(d.info),
          items: parseProgramsFromArray(d.response),
          status: d.success,
        };
      });
  } catch (error) {
    throw error;
  }
  return r;
};

const store = async (isUpdating: boolean, data: FormData) => {
  let res: Program;
  try {
    res = await axios
      .post(
        isUpdating ? apiEndpoints.programsUpdate : apiEndpoints.programsStore,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((r) => {
        const d = extractAxiosData(r) || [];
        if (!d.success || false) {
          throw new Error(`HTTP error! status: Failed to create program`);
        }
        return parseProgramFromObject(d.id);
      });
  } catch (error) {
    throw error;
  }
  return res;
};

const getPayload = (data: ProgramFormFields) => {
  let payload = new FormData();
  payload.append("name_type", "STRING");
  payload.append("name", data.name);
  payload.append("id_type", "STRING");
  payload.append("id", "" + data.id);
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
  payload.append("total_funding_usd_type", "INTEGER");
  payload.append("total_funding_usd", "" + data.total_funding_usd);
  payload.append("description_type", "STRING");
  payload.append("description", data.description);
  payload.append("status_type", "STRING");
  payload.append("status", "draft");
  payload.append("locations_type", "STRING");
  payload.append("solicitations_type", "STRING");
  payload.append("solicitations", "to_be_filled_later");
  payload.append("documents_type", "STRING");

  //Locations
  data.locations?.forEach((loc) => {
    payload.append("locations", "" + loc);
  });

  //Documents
  data.fileInput?.forEach((doc) => {
    payload.append("fileInput", doc);
  });

  return payload;
};

export { get, store, show, solicitations };
