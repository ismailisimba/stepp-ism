import { PaginationData } from "@/models/Pagination";
import { ReportSectionQuestions } from "@/models/ReportSectionQuestion";

export type SnackbarColor = "primary" | "error" | "warning" | "success";

export type OrderType = "ASC" | "DESC";

export type tableIds =
  | "program"
  | "project"
  | "solicitation"
  | "application"
  | "reports";

export interface Items {
  items: Array<any>;
  paginationData: PaginationData;
  success?: boolean;
}

export interface QuestionFieldType {
  icon: string;
  value: string;
  name: string;
  maxLength?: number;
}

export interface SchemaDataType {
  countries: Array<string>;
  program: { status: Array<string> };
  application: { status: Array<string> };
  solicitation: { status: Array<string> };
  project: { status: Array<string> };
  reports: { status: Array<string> };
  defaultReportQuestions: ReportSectionQuestions;
}

export type Status =
  | "Draft"
  | "In Review"
  | "Published"
  | "Active"
  | "Expired"
  | "Closed";

export type SearchFieldOrders = "ascending" | "descending";

export interface SearchFieldData {
  advanceSearchValues?: Array<Object | null>;
  basicSearch: string | null;
  tableId: tableIds;
  orderType: SearchFieldOrders;
}
