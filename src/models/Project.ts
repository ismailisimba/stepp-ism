import { firstLetterUpperCase } from "@/helpers/stringHelper";
import { Activities, Activity, parseActivitiesFromArray } from "./Activity";
import { parseStatusFromString, Status } from "./Status";

export interface Project {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  budgetUSD: number;
  reportSchedule?: string;
  status: Status;
  programId: string;
  programName: string;
  solicitationId: string;
  solicitationName: string;
  applicationId: string;
  projectAnswersUrl: string;
  solicitationAnswersUrl: string;
  contactName: string;
  contactEmail: string;
  activities: Activities;
  answerData: Array<any> | null;
  answerDataId: string;
  createdAt?: Date | null;
}

export interface ProjectGraphData {
  count: number;
  total: number;
  published: number;
  draft: number;
  created: number;
  inReview: number;
}

export type Projects = Project[];

export function parseProjectsFromArray(objs: Object[]): Projects {
  const projects: Projects = [];
  for (const obj of objs) {
    const p = parseProjectFromObject(obj);
    projects.push(p);
  }
  return projects;
}

export function parseProjectFromObject(obj: any): Project {
  const p: Project = {
    id: obj["id"] || null,
    name: obj["name"] || null,
    startDate: new Date(obj["start_date"].value) || null,
    endDate: new Date(obj["end_date"].value) || null,
    budgetUSD: obj["total_budget_usd"] || null,
    programId: obj["program_id"] || null,
    programName: obj["program_name"] || null,
    solicitationId: obj["solicitation_id"] || null,
    solicitationName: obj["solicitation_name"] || null,
    applicationId: obj["application_id"] || null,
    description: obj["description"] || null,
    projectAnswersUrl: obj["project_answers"] || null,
    solicitationAnswersUrl: obj["solicitation_answers"] || null,
    contactName: obj["contact_name"] || null,
    contactEmail: obj["contact_email"] || null,
    status: obj["status"] ? parseStatusFromString(obj["status"]) : "Unknown",
    activities: obj["activities"]
      ? parseActivitiesFromArray(obj["activities"])
      : [],
    createdAt: obj["created_date"] ? new Date(obj["created_date"].value) : null,
    answerData: obj["answerData"] ? obj["answerData"] : null,
    answerDataId: obj["answerDataId"] ? obj["answerDataId"] : null,
  };
  return p;
}

export function parseProjectAnswersFromObject(obj: any): Project {
  const p: Project = {
    id: obj["projectId"][0] || null,
    name: obj["Project_Name"][0] || null,
    startDate: new Date(obj["Start_Date"][0]) || null,
    endDate: new Date(obj["End_Date"][0]) || null,
    reportSchedule: firstLetterUpperCase(obj["Reporting_Schedule"][0]) || "",
    budgetUSD: obj["Budget"][0] || null,
    programId: obj["program_id"] || null,
    programName: obj["program_name"] || null,
    solicitationId: obj["solicitation_id"] || null,
    solicitationName: obj["solicitation_name"] || null,
    applicationId: obj["application_id"] || null,
    description: obj["Description"][0] || null,
    projectAnswersUrl: obj["project_answers"] || null,
    solicitationAnswersUrl: obj["solicitation_answers"] || null,
    contactName: obj["contact_name"] || null,
    contactEmail: obj["contact_email"] || null,
    status: obj["status"][0]
      ? parseStatusFromString(obj["status"][0])
      : "Unknown",
    activities: parseActivitiesFromProjectAnswers(obj),
    answerData: obj["answerData"] ? obj["answerData"] : null,
    answerDataId: obj["answerDataId"] ? obj["answerDataId"] : null,
  };
  return p;
}

export function parseActivitiesFromProjectAnswers(obj: any): Activities {
  let activities: Activities = [];
  if (obj["Activity_Name"]) {
    for (let index = 0; index < obj["Activity_Name"].length; index++) {
      const a: Activity = {
        name: obj["Activity_Name"][index],
        startDate: new Date(obj["Activity_Start_Date"][index]) || null,
        endDate: new Date(obj["Activity_End_Date"][index]) || null,
        description: obj["Activity_Description"][index],
        associatedResults: obj["Associated_Results/Outputs"][index],
        associatedOutcomes: obj["Associated_Outcomes"][index],
      };
      activities.push(a);
    }
  }
  return activities;
}

export function parseProjectGraphDataFromObject(obj: any): ProjectGraphData {
  const d: ProjectGraphData = {
    count: obj["uniqueValuesCount"] ?? null,
    total: obj["totalCount"] ?? null,
    published: obj["uniqueValuesDetails"]["published"] ?? null,
    draft: obj["uniqueValuesDetails"]["draft"] ?? null,
    created: obj["uniqueValuesDetails"]["created"] ?? null,
    inReview: obj["uniqueValuesDetails"]["in_review"] ?? null,
  };
  return d;
}
