export interface PaginationData {
  currentPage: number;
  numberOfPages: number;
  itemsPerPage: number;
  totalNumOfItems: number;

}

export function parsePaginationDataFromObject(obj: any): PaginationData {
  const p: PaginationData = {
    currentPage: obj["currentPage"] || null,
    numberOfPages: obj["totalPages"] || null,
    itemsPerPage: parseInt(obj["pagesize"]) || 0,
    totalNumOfItems: parseInt(obj["numOfItems"]) || 0,
  };
  return p;
}

function isPaginationData(obj: any): obj is PaginationData {
  return (
    typeof obj.currentPage === "number" &&
    typeof obj.numberOfPages === "number" &&
    typeof obj.itemsPerPage === "number" &&
    typeof obj.totalNumOfItems === "number"
  );
}
