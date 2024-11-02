import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import axios from "axios";

const sendSupportQuery = async (data: FormData) => {
  let res;
  try {
    res = await axios
      .post(apiEndpoints.supportSendMessage, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return d;
      });
  } catch (error) {
    throw error;
  }
  return res;
};

export { sendSupportQuery };
