import getCountries from "@/services/location_service";
import { defineStore } from "pinia";

export const useCountryStore = defineStore("country", {
  state: () => ({ countries: <any>[], isLoading: <boolean>false }),
  getters: {},
  actions: {
    async loadCountries() {
      // Load only when array is empty
      if (this.countries.length == 0)
        try {
          this.isLoading = true;
          await getCountries().then((loc) => {
            this.countries = loc;
            this.isLoading = false;
          });
        } catch (error) {
          this.isLoading = false;
          throw error;
        }
    },
  },
});
