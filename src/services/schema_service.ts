import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parseReportSectionQuestionsFromArray } from "@/models/ReportSectionQuestion";
import { SchemaDataType } from "@/types/types";
import axios from "axios";

export const getSchema = async () => {
  let schema: SchemaDataType;
  try {
    schema = await axios.get(apiEndpoints.schema).then((r) => {
      const d = extractAxiosData(r) || [];
      const s: SchemaDataType = {
        countries: d.locations.countries || [],
        program: {
          status: d.specialInputs.program.status,
        },
        solicitation: {
          status: d.specialInputs.solicitation.status,
        },
        application: {
          status: d.specialInputs.application.status,
        },
        project: {
          status: d.specialInputs.project.status,
        },
        reports: {
          status: d.specialInputs.reports.status,
        },
        defaultReportQuestions: parseReportSectionQuestionsFromArray(
          d.defaultReportQuestions["sections"]
        ),
      };
      return s;
    });
  } catch (error) {
    throw error;
  }
  return schema;
};
