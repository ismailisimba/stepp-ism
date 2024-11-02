export interface ReportQuestionOption {
  text: string;
}

export type ReportQuestionOptions = ReportQuestionOption[];

export function parseReportQuestionOptionsFromArray(
  objs: Object[]
): ReportQuestionOptions {
  const options: ReportQuestionOptions = [];
  for (const obj of objs) {
    const p = parseReportQuestionOptionFromObject(obj);
    options.push(p);
  }
  return options;
}

export function parseReportQuestionOptionFromObject(
  obj: any
): ReportQuestionOption {
  const p: ReportQuestionOption = {
    text: obj["text"] ? obj["text"] : null,
  };
  return p;
}
