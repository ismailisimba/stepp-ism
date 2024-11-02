import { parseSolicitationQuestionSectionsFromArray, SolicitationQuestionSections } from "./SolicitationQuestionSection";

export interface ApplicationInfo {
  sections: SolicitationQuestionSections | null
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  solicitationId: string;
  solicitationName: string;
  submitStatus: string;
  submitStatusDate : Date
  markSubmitStatus : string
}

export function parseApplicationInfoFromObject(obj: any): ApplicationInfo {
  const p: ApplicationInfo = {
    sections: obj['sections'] ? parseSolicitationQuestionSectionsFromArray(obj['sections']) : null,
    applicantFirstName: obj["applicantFirstName"] || null,
    applicantLastName: obj["applicantLastName"] || null,
    applicantEmail: obj["applicantEmail"] || null,
    solicitationId: obj["solicitationId"] || null,
    solicitationName: obj["solicitationName"] || null,
    submitStatus: obj["submitStatus"] || null,
    submitStatusDate: new Date(obj["submitStatusDate"]) || null,
    markSubmitStatus: obj["markSubmitStatus"] || null,
  };
  return p;
}
