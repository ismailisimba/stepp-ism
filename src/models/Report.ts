import { isArray, isObject } from "@/helpers/general";
import {
  Activities,
  parseActivitiesFromArray,
  parseActivityFromObject,
} from "./Activity";
import { Status, parseStatusFromString } from "./Status";

export interface Report {
  id: string;
  name: string;
  status: Status;
  description: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  contactEmail: string;
  contactName: string;
  programId: string;
  programName: string;
  projectId: string;
  projectName: string;
  solicitationId: string;
  solicitationName: string;
  applicationId: string;
  applicationName: string;
  reportData: string;
  activities: Activities;
  solicitationAnswersUrl: string;
  documents: [];
}

export interface ReportGraphData {
  count: number;
  total: number;
  published: number;
  created: number;
  inReview: number;
}

export type Reports = Report[];

export function parseReportsFromArray(objs: Object[]): Reports {
  const reports: Reports = [];
  for (const obj of objs) {
    const p = parseReportFromObject(obj);
    reports.push(p);
  }
  return reports;
}

export function parseReportFromObject(obj: any): Report {
  const acts = parseActivities(obj["activities"]);
  const p: Report = {
    id: obj["id"] || null,
    name: obj["name"] || null,
    status: obj["status"] ? parseStatusFromString(obj["status"]) : "Unknown",
    description: obj["description"] || null,
    startDate: new Date(obj["start_date"].value) || null,
    endDate: new Date(obj["end_date"].value) || null,
    createdAt: new Date(obj["created_date"].value) || null,
    contactEmail: obj["contact_email"] || null,
    contactName: obj["contact_name"] || null,
    programId: obj["program_id"] || null,
    programName: obj["program_name"] || null,
    projectId: obj["project_id"] || null,
    projectName: obj["project_name"] || null,
    solicitationId: obj["solicitation_id"] || null,
    solicitationName: obj["solicitation_name"] || null,
    applicationId: obj["application_name"] || null,
    applicationName: obj["application_name"] || null,
    reportData: obj["report_data"] || null,
    activities: parseActivitiesFromArray(acts || []),
    solicitationAnswersUrl: obj["solicitation_answers"] || null,
    documents: obj["documents"] ? obj["documents"].split(", ") : null,
  };
  return p;
}

function parseActivities(activities: any) {
  switch (typeof activities) {
    case "string":
      const acts = JSON.parse(activities);
      if (isObject(acts)) {
        return [acts];
      } else if (isArray(acts)) {
        return acts;
      } else {
        acts;
      }
    default:
      return activities;
  }
}

export function parseReportGraphDataFromObject(obj: any): ReportGraphData {
  const d: ReportGraphData = {
    count: obj["uniqueValuesCount"] ?? null,
    total: obj["totalCount"] ?? null,
    published: obj["uniqueValuesDetails"]["published"] ?? null,
    created: obj["uniqueValuesDetails"]["created"] ?? null,
    inReview: obj["uniqueValuesDetails"]["in_review"] ?? null,
  };
  return d;
}
