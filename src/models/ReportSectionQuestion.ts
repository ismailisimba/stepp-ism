import {
  parseReportQuestionFromArray,
  ReportQuestions,
} from "./ReportQuestion";

export interface ReportSectionQuestion {
  title?: string | null;
  questions: ReportQuestions;
}

export type ReportSectionQuestions = ReportSectionQuestion[];

export function parseReportSectionQuestionsFromArray(
  objs: Object[]
): ReportSectionQuestions {
  const sections: ReportSectionQuestions = [];
  for (const obj of objs) {
    const p = parseReportSectionQuestionsFromObject(obj);
    sections.push(p);
  }
  return sections;
}

export function parseReportSectionQuestionsFromObject(
  obj: any
): ReportSectionQuestion {
  const p: ReportSectionQuestion = {
    title: obj["title"] || null,
    questions: obj["questions"]
      ? parseReportQuestionFromArray(obj["questions"])
      : [],
  };
  return p;
}
