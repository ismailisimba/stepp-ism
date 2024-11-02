export interface FileInfo {
  id: string | null;
  idInternal: string | null;
  filename: string | null;
  contentType: string | null;
  md5Hash: string | null;
  size: number | null;
  isDownloading: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function parseFileInfoFromObject(obj: any): FileInfo {
  const p: FileInfo = {
    id: obj["id"] || null,
    idInternal: obj["id_internal"] || null,
    filename: obj["originalFileName"] || null,
    contentType: obj["contentType"] || null,
    md5Hash: obj["md5Hash"] || null,
    size: obj["size"] || null,
    isDownloading: false,
    createdAt: obj["timeCreated"] ? new Date(obj["timeCreated"]) : null,
    updatedAt: obj["timeLastUpdated"] ? new Date(obj["timeLastUpdated"]) : null,
  };
  return p;
}
