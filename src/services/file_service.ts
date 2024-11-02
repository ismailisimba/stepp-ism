import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { FileInfo, parseFileInfoFromObject } from "@/models/FileInfo";
import axios from "axios";

const getFilesInfo = async (ids: Array<string>) => {
  let filesInfo: FileInfo[];
  try {
    const requests = ids.map((id) =>
      axios.get(`${apiEndpoints.fileInfo}/${encodeURIComponent(id)}`)
    );
    const res = await axios.all(requests);
    filesInfo = res
      .map((r) => {
        const d = extractAxiosData(r) || [];
        if (d["originalFileName"]) return parseFileInfoFromObject(d);
        return null;
      })
      .filter((d) => d !== null);
  } catch (error) {
    throw error;
  }
  return filesInfo;
};

const getFileInfo = async (fileId: string) => {
  let fileInfo: FileInfo;
  try {
    fileInfo = await axios
      .get(`${apiEndpoints.fileInfo}/${encodeURIComponent(fileId)}`)
      .then((r) => {
        console.log(r);
        const d = extractAxiosData(r) || [];
        return parseFileInfoFromObject(d);
      });
  } catch (error) {
    throw error;
  }
  return fileInfo;
};

const downloadFile = async (fileId: string, filename: string) => {
  let success: boolean;
  try {
    success = await axios
      .get(`${apiEndpoints.fileGet}/${encodeURIComponent(fileId)}`, {
        responseType: "blob",
      })
      .then((r) => {
        const url = window.URL.createObjectURL(new Blob([r.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
      });
  } catch (error) {
    throw error;
  }
  return success;
};

const getFile = async (fileId: string) => {
  let file;
  try {
    file = await axios
      .get(`${apiEndpoints.fileGet}/${encodeURIComponent(fileId)}`)
      .then((r) => {
        return r;
      });
  } catch (error) {
    throw error;
  }
  return file;
};

export { getFileInfo, getFile, getFilesInfo, downloadFile };
