import { Applications } from "@/models/Application";
import { Programs } from "@/models/Program";
import { Projects } from "@/models/Project";
import { Reports } from "@/models/Report";
import { Solicitations } from "@/models/Solicitation";
import { tableIds } from "@/types/types";
import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    table : <tableIds | null> null,
    results: <Solicitations | Programs | Projects | Applications | Reports | null>null,
  }),

  actions: {
    async set(table : tableIds, results : any) {
      this.table = table;
      this.results = results;
    },
  },
});
