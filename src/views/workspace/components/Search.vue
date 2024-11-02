<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        flat
        variant="text"
        v-bind="activatorProps"
        prepend-icon="mdi-magnify"
        class="text-none"
        :text="t('search')"
      >
      </v-btn>
    </template>

    <v-card rounded="lg" max-height="600">
      <v-card-title class="ma-0 pa-0">
        <v-row style="height: 60px" no-gutters class="px-2 mt-3">
          <v-col cols="11">
            <v-text-field
              flat
              v-model="state.search"
              class="pa-0 ma-0 align-center"
              :disabled="isAdvanced"
              prepend-inner-icon="mdi-magnify"
              :placeholder="t('search')"
              density="comfortable"
              @keyup="autoSearch"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-btn
              variant="plain"
              icon="mdi-tune"
              :disabled="false"
              @click="isAdvanced = !isAdvanced"
            >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="py-0 my-0">
        <v-sheet v-if="!isAdvanced">
          <div class="text-center" v-if="!hideSearchMgs">
            <v-icon
              color="grey-lighten-1"
              size="150"
              icon="mdi-text-search"
            ></v-icon>
            <br />
            <p class="text-medium-emphasis pb-5">{{ t("searchResultsMsg") }}</p>
          </div>
          <ProgramSearchResults
            @click="close"
            v-if="searchTable == 'program' && searchResults != null"
            :programs="searchResults as Programs"
          />

          <SolSearchResults
            @click="close"
            v-if="searchTable == 'solicitation' && searchResults != null"
            :solicitations="searchResults as Solicitations"
          />

          <AppSearchResults
            @click="close"
            v-if="searchTable == 'application' && searchResults != null"
            :applications="searchResults as Applications"
          />

          <ProjectSearchResults
            @click="close"
            v-if="searchTable == 'project' && searchResults != null"
            :projects="searchResults as Projects"
          />

          <ReportSearchResults
            @click="close"
            v-if="searchTable == 'reports' && searchResults != null"
            :reports="searchResults as Reports"
          />
        </v-sheet>

        <v-row v-if="isAdvanced" dense class="pt-0 mt-0">
          <!-- Start date -->
          <v-col cols="12" sm="12" md="6" v-if="searchTable != 'application'">
            <DatePicker
              density="comfortable"
              v-model="state.start_date_from"
              :label="$t('startDateFrom')"
            />
          </v-col>

          <v-col cols="12" sm="12" md="6" v-if="searchTable != 'application'">
            <DatePicker
              density="comfortable"
              v-model="state.start_date_to"
              :label="$t('startDateTo')"
            />
          </v-col>
          <!-- End start date -->

          <!-- End date -->
          <v-col cols="12" sm="12" md="6" v-if="searchTable != 'application'">
            <DatePicker
              density="comfortable"
              v-model="state.end_date_from"
              :label="$t('endDateFrom')"
            />
          </v-col>

          <v-col cols="12" sm="12" md="6" v-if="searchTable != 'application'">
            <DatePicker
              density="comfortable"
              v-model="state.end_date_to"
              :label="$t('endDateTo')"
            />
          </v-col>
          <!-- End end date -->

          <v-col cols="12" sm="12" md="6" v-if="searchTable == 'program'">
            <v-text-field
              prefix="$"
              v-model="state.minFunding"
              density="comfortable"
              :label="t('minFunding')"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="6" v-if="searchTable == 'program'">
            <v-text-field
              prefix="$"
              v-model="state.maxFunding"
              density="comfortable"
              :label="t('maxFunding')"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="6" v-if="searchTable == 'solicitation'">
            <v-text-field
              prefix="$"
              v-model="state.maxFundingPerProject"
              density="comfortable"
              :label="t('minFundingPerProject')"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="6" v-if="searchTable == 'solicitation'">
            <v-text-field
              prefix="$"
              v-model="state.minFundingPerProject"
              density="comfortable"
              :label="t('maxFundingPerProject')"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="6" v-if="searchTable == 'project'">
            <v-text-field
              prefix="$"
              v-model="state.minTotalBudget"
              density="comfortable"
              :label="t('minTotalBudget')"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="6" v-if="searchTable == 'project'">
            <v-text-field
              prefix="$"
              v-model="state.maxTotalBudget"
              density="comfortable"
              :label="t('maxTotalBudget')"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            v-if="searchTable == 'program' || searchTable == 'solicitation'"
          >
            <v-autocomplete
              density="comfortable"
              on
              :loading="loadingLocations"
              v-model="state.locations"
              :items="locations"
              bg-color="white"
              color="primary"
              item-title="name"
              item-value="name"
              :label="$t('locations')"
              chips
              closable-chips
              multiple
            >
            </v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-select
              :loading="schemaStore.isLoading"
              density="comfortable"
              v-model="state.status"
              :items="status"
              :label="$t('status')"
              chips
              closable-chips
              multiple
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="isAdvanced">
        <v-spacer></v-spacer>
        <v-btn
          :text="t('close')"
          class="text-none"
          variant="plain"
          @click="close"
        ></v-btn>
        <v-btn
          :loading="isSearching"
          color="primary"
          :text="t('search')"
          variant="tonal"
          class="text-none"
          @click="searchItems()"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import DatePicker from "@/views/components/inputs/DatePicker.vue";
import getCountries from "@/services/location_service";
import { appConstants } from "@/constants/app_constants";
import { onMounted } from "vue";
import { search } from "@/services/search_service";
import { SearchFieldData, tableIds } from "@/types/types";
import { useRoute } from "vue-router";
import { defineAsyncComponent } from "vue";
import { Programs } from "@/models/Program";
import { Projects } from "@/models/Project";
import { Applications } from "@/models/Application";
import { Reports } from "@/models/Report";
import { Solicitations } from "@/models/Solicitation";
import { useSchemaStore } from "@/store/schemaStore";
import { firstLetterUpperCase } from "@/helpers/stringHelper";
import router from "@/router";
import { useSearchStore } from "@/store/searchStore";

const ProgramSearchResults = defineAsyncComponent(
  () => import("@/views/search/components/ProgramSearchResults.vue")
);

const SolSearchResults = defineAsyncComponent(
  () => import("@/views/search/components/SolSearchResults.vue")
);

const AppSearchResults = defineAsyncComponent(
  () => import("@/views/search/components/AppSearchResults.vue")
);

const ProjectSearchResults = defineAsyncComponent(
  () => import("@/views/search/components/ProjectSearchResults.vue")
);

const ReportSearchResults = defineAsyncComponent(
  () => import("@/views/search/components/ReportSearchResults.vue")
);

const schemaStore = useSchemaStore();
const searchStore = useSearchStore();

const dialog = ref(false);
const locations = ref();
const { t } = useI18n();
const loadingLocations = ref(false);
const isSearching = ref(false);
const isAdvanced = ref(false);
const route = useRoute();
const searchResults = ref<
  Programs | Projects | Applications | Reports | Solicitations | null
>();

const formState: SearchFormFields = {
  search: "",
  start_date_from: null,
  start_date_to: null,
  end_date_from: null,
  end_date_to: null,
  maxFunding: null,
  minFunding: null,
  maxFundingPerProject: null,
  minFundingPerProject: null,
  minTotalBudget: null,
  maxTotalBudget: null,
  locations: null,
  status: null,
};

// Define emits
const emit = defineEmits<{
  (e: "close"): void;
}>();

const state = reactive({
  ...formState,
});

const hideSearchMgs = computed(() => {
  return (
    !isAdvanced.value && state.search.length > 1 && searchResults.value != null
  );
});

const canAuthSearch = computed(() => {
  return state.search.length > 2 && !isAdvanced.value;
});

const searchTable = computed(() => {
  if (route.params.searchable) return route.params.searchable as tableIds;

  return (
    (route.meta.searchTable as tableIds) || appConstants.defaultSearchTable
  );
});

const close = () => {
  emit("close");
  dialog.value = false;
  setTimeout(() => {
    reset();
  }, 2000);
};

const autoSearch = () => {
  if (canAuthSearch.value && !isSearching.value) {
    searchItems();
  } else {
    searchResults.value = null;
  }
};

const getLocs = async () => {
  try {
    loadingLocations.value = true;
    await getCountries().then((loc) => {
      locations.value = loc;
      loadingLocations.value = false;
    });
  } catch (error) {
    loadingLocations.value = false;
    throw error;
  }
};

const reset = () => {
  for (const [key, value] of Object.entries(formState)) {
    (state as any)[key] = value;
  }
  isAdvanced.value = false;
  searchResults.value = null;
  isSearching.value = false;
};

const searchItems = async () => {
  try {
    isSearching.value = true;
    await search(payload()).then(async (results: any) => {
      if (isAdvanced.value) {
        await searchStore.set(searchTable.value, results);
        router.push({
          name: "advanced-search",
          params: { searchable: searchTable.value },
        });
        close();
      } else {
        searchResults.value = results || null;
      }
      isSearching.value = false;
    });
  } catch (error) {
    isSearching.value = false;
    throw error;
  }
};

const payload = () => {
  let p: SearchFieldData;
  p = {
    basicSearch: state.search,
    tableId: searchTable.value,
    orderType: "ascending",
    advanceSearchValues: [
      {
        name: "start_date",
        start: state.start_date_from?.toISOString().substring(0, 10),
        end: state.start_date_to?.toISOString().substring(0, 10),
      },
      {
        name: "end_date",
        start: state.end_date_from?.toISOString().substring(0, 10),
        end: state.end_date_to?.toISOString().substring(0, 10),
      },
      {
        name: "total_funding_usd",
        start: state.minFunding,
        end: state.maxFunding,
      },
      {
        name: "funding_per_project_usd",
        start: state.minFundingPerProject,
        end: state.maxFundingPerProject,
      },
      {
        name: "total_budget_usd",
        start: state.minTotalBudget,
        end: state.maxTotalBudget,
      },
    ],
  };
  p = genLocs(p);
  p = genStatus(p);
  return p;
};
const status = computed(() => {
  switch (searchTable.value) {
    case "program":
      return schemaStore.programStatus.map((s) => firstLetterUpperCase(s));

    case "solicitation":
      return schemaStore.solicitationStatus.map((s) => firstLetterUpperCase(s));

    case "application":
      return schemaStore.applicationStatus.map((s) => firstLetterUpperCase(s));

    case "project":
      return schemaStore.projectStatus.map((s) => firstLetterUpperCase(s));

    case "reports":
      return schemaStore.reportsStatus.map((s) => firstLetterUpperCase(s));

    default:
      return [];
  }
});

const genLocs = (p: SearchFieldData) => {
  if (state.locations) {
    for (let index = 0; index < state.locations.length; index++) {
      p.advanceSearchValues?.push({
        name: "locations",
        value: state.locations[index],
        checked: true,
      });
    }
  }
  return p;
};

const genStatus = (p: SearchFieldData) => {
  if (state.status) {
    for (let index = 0; index < state.status.length; index++) {
      p.advanceSearchValues?.push({
        name: "status",
        value: state.status[index].toLocaleLowerCase(),
        checked: true,
      });
    }
  }
  return p;
};

const props = defineProps<{
  show: boolean;
}>();

watch(
  () => props.show,
  (newValue) => {
    dialog.value = newValue;
  }
);

onMounted(async () => {
  await getLocs();
  await schemaStore.getSchema();
});
</script>

<style scoped></style>
