export interface SolicitationQuestionOption {
  text: string;
}

export type SolicitationQuestionOptions = SolicitationQuestionOption[];

export function parseSolicitationQuestionOptionsFromArray(
  objs: Object[]
): SolicitationQuestionOptions {
  const options: SolicitationQuestionOptions = [];
  for (const obj of objs) {
    const p = parseSolicitationQuestionOptionFromObject(obj);
    options.push(p);
  }
  return options;
}

export function parseSolicitationQuestionOptionFromObject(
  obj: any
): SolicitationQuestionOption {
  const p: SolicitationQuestionOption = {
    text: obj["text"] ? obj["text"] : null,
  };
  return p;
}
