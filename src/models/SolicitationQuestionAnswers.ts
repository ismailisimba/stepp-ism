import {
  parseSolicitationQuestionSectionsFromArray,
  SolicitationQuestionSections,
} from "./SolicitationQuestionSection";

export interface SolicitationQuestionAnswers {
  answerStatus: string;
  submitted: boolean;
  canEdit: boolean;
  markStatus: string;
  marked: boolean;
  answers: SolicitationQuestionSections;
}

export function parseSolicitationQuestionAnswersFromObject(
  obj: any
): SolicitationQuestionAnswers {
  const p: SolicitationQuestionAnswers = {
    answerStatus: obj["answerStatus"] || "",
    submitted: obj["answerStatus"]
      ? obj["answerStatus"] == "submitted"
        ? true
        : false
      : false,
    canEdit: obj["answerStatus"]
      ? obj["answerStatus"] == "submitted"
        ? false
        : true
      : true,
    markStatus: obj["markStatus"] || "",
    marked: obj["markStatus"]
      ? obj["markStatus"] == "submitted"
        ? true
        : false
      : false,
    answers: parseSolicitationQuestionSectionsFromArray(getSections(obj)),
  };
  return p;
}

const getSections = (obj: any) => {
  if (obj["oldAnswers"]) return obj["oldAnswers"]["sections"];
  else if (obj["sections"]) return obj["sections"];
  else return [];
};
