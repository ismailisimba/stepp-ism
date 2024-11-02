import { useAuthStore } from "@/store/authStore";
import { Status } from "@/types/types";

export interface Application {
  id: string;
  name: string;
  status: Status;
  marks: number;
  rank: number;
  avgMarks: number;
  contactEmail: string;
  solicitationId: string;
  solicitationName: string;
  programId: string;
  programName: string;
  applicantName: string;
  solicitationAnswers: string;
  createdAt: Date;
}

export interface ApplicationGraphData {
  count: number;
  total: number;
  awarded: number;
  inMarking: number;
  draft: number;
  submitted: number;
}

export type Applications = Application[];

export function parseApplicationsFromArray(objs: Object[]): Applications {
  const applications: Applications = [];
  for (const obj of objs) {
    const p = parseApplicationFromObject(obj);
    applications.push(p);
  }
  return applications;
}

export function parseApplicationFromObject(obj: any): Application {
  const p: Application = {
    id: obj["id"] || null,
    name: obj["name"] || null,
    status: obj["status"] || null,
    marks: obj["marks"] || null,
    rank: obj["rank"] || null,
    avgMarks: obj["avg_marks"] || null,
    contactEmail: obj["contact_email"] || null,
    programId: obj["program_id"] || null,
    programName: obj["program_name"] || "Program name",
    solicitationId: obj["solicitation_id"] || null,
    solicitationName: obj["solicitation_name"] || "Solicitation name",
    solicitationAnswers: obj["solicitation_answers"] || null,
    applicantName: obj["applicant_name"] || null,
    createdAt: new Date(obj["created_date"]) || null,
  };
  return p;
}

export function parseApplicationGraphDataFromObject(obj: any): ApplicationGraphData {
  const d: ApplicationGraphData = {
    count: obj["uniqueValuesCount"] ?? null,
    total: obj["totalCount"] ?? null,
    awarded: obj["uniqueValuesDetails"]["awarded"] ?? null,
    draft: obj["uniqueValuesDetails"]["draft"] ?? null,
    inMarking: obj["uniqueValuesDetails"]["in_marking"] ?? null,
    submitted: obj["uniqueValuesDetails"]["submitted"] ?? null,
  };
  return d;
}


export function applicantGenerateAnswersUrl(
  solId: string,
  applicantEmail: string
): string {
  return `${solId}/${applicantEmail}/answersJson`;
}

export function applicantGenerateMarksUrl(
  solId: string,
  applicantEmail: string
): string {
  const authStore = useAuthStore();
  return `${solId}/marksJson/${authStore.email}/${applicantEmail}/marksJson`;
}
