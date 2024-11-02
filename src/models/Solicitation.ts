import { parseStatusFromString, Status } from "./Status";

export interface Solicitation {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  fundingPerProjectUSD: number;
  status: Status;
  locations: [];
  programName: string;
  programId: string;
  questions: [];
  documents: [];
  appReviewStatus: boolean;
  createdAt: Date;
}

export interface SolicitationGraphData {
  count: number;
  total: number;
  published: number;
  draft: number;
  inReview: number;
}

export type Solicitations = Solicitation[];

export function parseSolicitationsFromArray(objs: Object[]): Solicitations {
  const solicitations: Solicitations = [];

  for (const obj of objs) {
    const p = parseSolicitationFromObject(obj);
    solicitations.push(p);
  }
  return solicitations;
}

export function parseSolicitationFromObject(obj: any): Solicitation {
  const p: Solicitation = {
    id: obj["id"] || null,
    name: obj["name"] || null,
    startDate: new Date(obj["start_date"].value) || null,
    endDate: new Date(obj["end_date"].value) || null,
    fundingPerProjectUSD: obj["funding_per_project_usd"] || null,
    description: obj["description"] || null,
    locations: obj["locations"].split(", ") || null,
    status: parseStatusFromString(obj["status"]) || null,
    questions: obj["solicitation_questions"].split(", ") || [],
    programId: obj["program_id"] || null,
    programName: obj["program"] || null,
    documents: obj["documents"].split(", ") || null,
    appReviewStatus: obj["application_review_status"]
      ? obj["application_review_status"] == "complete"
        ? true
        : false
      : false,
    createdAt: new Date(obj["created_date"]) || null,
  };
  return p;
}

export function parseSolicitationGraphDataFromObject(
  obj: any
): SolicitationGraphData {
  const d: SolicitationGraphData = {
    count: obj["uniqueValuesCount"] ?? null,
    total: obj["totalCount"] ?? null,
    published: obj["uniqueValuesDetails"]["published"] ?? null,
    draft: obj["uniqueValuesDetails"]["draft"] ?? null,
    inReview: obj["uniqueValuesDetails"]["in_review"] ?? null,
  };
  return d;
}
