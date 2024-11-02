import { parseStatusFromString, Status } from "./Status";

export type ProgramStatus =
  | "Draft"
  | "In Review"
  | "Published"
  | "Active"
  | "Expired"
  | "Closed";

export interface Program {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  fundingUSD: number;
  status: Status;
  locations: [];
  solicitations: [];
  documents: [];
}

export interface ProgramGraphData {
  count: number;
  total: number;
  draft: number;
  published: number;
  inMarking: number;
  inReview: number;
  submitted: number;
  awarded : number;
}

export type Programs = Program[];

export function parseProgramsFromArray(objs: Object[]): Programs {
  const programs: Program[] = [];

  for (const obj of objs) {
    const p = parseProgramFromObject(obj);
    programs.push(p);
  }
  return programs;
}

export function parseProgramFromObject(obj: any): Program {
  const startDate = obj["start_date"] ||  obj["startDate"];
  const endDate = obj["end_date"] ||  obj["endDate"];
  const p: Program = {
    id: obj["id"] || null,
    name: obj["name"] || null,
    startDate: new Date(startDate.value) || null,
    endDate: new Date(endDate.value) || null,
    fundingUSD: obj["total_funding_usd"] || null,
    description: obj["description"] || null,
    locations: obj["locations"].split(", ") || null,
    status: obj["status"] ? parseStatusFromString(obj["status"]) : "Unknown",
    solicitations: obj["solicitations"]
      ? obj["solicitations"].split(", ")
      : [],
    documents: obj["documents"].split(", ") || [],
  };
  return p;
}

export function parseProgramGraphDataFromObject(obj: any): ProgramGraphData {
  const d: ProgramGraphData = {
    count: obj["uniqueValuesCount"] ?? null,
    total: obj["totalCount"] ?? null,
    published: obj["uniqueValuesDetails"]["published"] ?? null,
    draft: obj["uniqueValuesDetails"]["draft"] ??  null,
    inReview: obj["uniqueValuesDetails"]["in_review"] ?? null,
    awarded: obj["uniqueValuesDetails"]["awarded"] ?? null,
    inMarking: obj["uniqueValuesDetails"]["in_marking"] ?? null,
    submitted: obj["uniqueValuesDetails"]["submitted"] ?? null,
  };
  return d;
}
