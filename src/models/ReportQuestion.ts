import { ReportQuestionOptions } from "./ReportQuestionOption";

export interface ReportQuestion {
  type: string;
  text: string | null;
  options?: ReportQuestionOptions;
  wordLimit: number | null;
  userInput?: string | Array<string | number> | Date;
}

export type ReportQuestions = ReportQuestion[];

export function parseReportQuestionFromArray(objs: Object[]): ReportQuestions {
  const questions: ReportQuestions = [];
  for (const obj of objs) {
    const p = parseReportQuestionFromObject(obj);
    questions.push(p);
  }
  return questions;
}

export function parseReportQuestionFromObject(obj: any): ReportQuestion {
  const p: ReportQuestion = {
    type: obj["type"] || null,
    text: obj["text"] ? obj["text"] : null,
    options: obj["options"] ? [] : [],
    wordLimit: obj["wordLimit"] ? obj["wordLimit"] : false,
    userInput: obj["userInput"] ? obj["userInput"] : null,
  };
  return p;
}
