import {
  parseSolicitationQuestionOptionsFromArray,
  SolicitationQuestionOptions,
} from "./SolicitationQuestionOption";

export interface SolicitationQuestion {
  type: string;
  text: string | null;
  options?: SolicitationQuestionOptions | [];
  required: boolean;
  markFull?: number | null;
  markAwarded?: number | null;
  markComment?: string | null;
  userInput?: string | Array<string | number> | Date;
}

export type SolicitationQuestions = SolicitationQuestion[];

export function parseSolicitationQuestionFromArray(
  objs: Object[]
): SolicitationQuestions {
  const questions: SolicitationQuestions = [];
  for (const obj of objs) {
    const p = parseSolicitationQuestionFromObject(obj);
    questions.push(p);
  }
  return questions;
}

export function parseSolicitationQuestionFromObject(
  obj: any
): SolicitationQuestion {
  const p: SolicitationQuestion = {
    type: obj["type"] || null,
    text: obj["text"] ? obj["text"] : null,
    options: obj["options"]
      ? parseSolicitationQuestionOptionsFromArray(obj["options"])
      : [],
    required: obj["required"] ? obj["required"] : false,
    markFull: obj["markFull"] ? obj["markFull"] : null,
    markAwarded: obj["markAwarded"] ? obj["markAwarded"] : null,
    markComment: obj["markComment"] ? obj["markComment"] : null,
    userInput: obj["userInput"] ? obj["userInput"] : null,
  };
  return p;
}
