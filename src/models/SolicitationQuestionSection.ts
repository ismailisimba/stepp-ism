import { parseSolicitationQuestionFromArray, SolicitationQuestions } from "./SolicitationQuestion";

export interface SolicitationQuestionSection {
  title?: string | null;
  questions: SolicitationQuestions;
  //name: string;
}

export type SolicitationQuestionSections = SolicitationQuestionSection[];

export function parseSolicitationQuestionSectionsFromArray(
  objs: Object[]
): SolicitationQuestionSections {
  const questions: SolicitationQuestionSections = [];
  for (const obj of objs) {
    const p = parseSolicitationQuestionSectionFromObject(obj);
    questions.push(p);
  }
  return questions;
}

export function parseSolicitationQuestionSectionFromObject(
  obj: any
): SolicitationQuestionSection {
  const p: SolicitationQuestionSection = {
    title: obj["title"] || null,
    questions: obj["questions"] ? parseSolicitationQuestionFromArray(obj["questions"]) : [],
    //name: obj["name"] || null,
  };
  return p;
}
