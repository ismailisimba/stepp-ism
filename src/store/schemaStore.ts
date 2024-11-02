import { ReportSectionQuestions } from "@/models/ReportSectionQuestion";
import { getSchema } from "@/services/schema_service";
import { SchemaDataType } from "@/types/types";
import { defineStore } from "pinia";

export const useSchemaStore = defineStore("schema", {
  state: () => ({
    schema: <SchemaDataType | null>null,
    isLoading: <boolean>false,
  }),

  getters: {
    countries(state): Array<string> | [] {
      return state.schema?.countries || [];
    },

    programStatus(state): Array<string> | [] {
      return state.schema?.program.status || [];
    },

    solicitationStatus(state): Array<string> | [] {
      return state.schema?.solicitation.status || [];
    },

    applicationStatus(state): Array<string> | [] {
      return state.schema?.application.status || [];
    },

    projectStatus(state): Array<string> | [] {
      return state.schema?.project.status || [];
    },

    reportsStatus(state): Array<string> | [] {
      return state.schema?.reports.status || [];
    },

    defaultReportQuestions(state): ReportSectionQuestions | null {
      return state.schema?.defaultReportQuestions || null;
    },
  },

  actions: {
    async getSchema() {
      if (this.schema == null)
        try {
          this.isLoading = true;
          await getSchema().then((res) => {
            this.schema = res;
            this.isLoading = false;
          });
        } catch (error) {
          this.isLoading = false;
          throw error;
        }
    },
  },
});
