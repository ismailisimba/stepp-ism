import { KeyValPair } from "@/types/KeyValPair";
import { QuestionFieldType } from "@/types/types";

interface AppContants {
  pagination: number;
  defaultSearchTable: string;
  dateFormat: string;
}

const appConstants: AppContants = {
  pagination: 25,
  defaultSearchTable: "program",
  dateFormat: "fullDate",
};

const colors : KeyValPair = {
  default: "#0F75BC",
  program : '#36A2EB',
  solicitation : '#FF6384',
  application : '#FFCE56',
  project : '#4BC0C0',
  report : '#9966FF',
}

const delayTime = {
  redirect: 2000,
};

const questionFieldType: Array<QuestionFieldType> = [
  {
    icon: "mdi-text-short",
    value: "short-paragraph",
    name: "shortParagraph",
    maxLength: 500,
  },
  { icon: "mdi-text", value: "paragraph", name: "paragraph", maxLength: 1000 },
  {
    icon: "mdi-checkbox-multiple-marked-circle",
    value: "multiple-choice",
    name: "multipleChoice",
  },
  {
    icon: "mdi-checkbox-multiple-marked-circle",
    value: "multiple-choice-one",
    name: "multipleChoiceOne",
  },
  { icon: "mdi-calendar-range", value: "date", name: "date" },
  { icon: "mdi-numeric", value: "number", name: "number" },
  { icon: "mdi-cloud-upload", value: "upload", name: "upload" },
];

const reportingSchedule: Array<string> = [
  'daily', 'weekly', 'monthly', 'quaterly', 'yearly'
]

const projectStatus: Array<string> = [
  'created', 'draft', 'inReview', 'published', 'expired', 'closed'
]

export { appConstants, questionFieldType, reportingSchedule, projectStatus, delayTime, colors };
