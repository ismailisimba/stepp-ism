<template>
  <ZeroSearchResults v-if="!results" />
  <v-container v-else fluid class="pa-8">
    <v-row class="pb-3">
      <v-col>
        <PageHeader :text="pageTitle" />
      </v-col>
    </v-row>

    <!-- Program list -->
    <DonorProgramList
      v-if="isDonor && table == 'program'"
      :page="1"
      :items-per-page="programs?.length ?? 0"
      :page-count="1"
      :items-count="programs?.length ?? 0"
      :is-loading-data="false"
      :programs="programs"
      :disable-delete="true"
      :disable-edit="true"
      :hide-footer="true"
    />

    <ApplicantProgramList
      v-if="isApplicant && table == 'program'"
      :page="1"
      :items-per-page="programs?.length ?? 0"
      :page-count="1"
      :items-count="programs?.length ?? 0"
      :is-loading-data="false"
      :programs="programs"
      :hide-footer="true"
    />
    <!-- End program list -->

    <!-- Solicitation list -->
    <DonorSolicitationList
      v-if="isDonor && table == 'solicitation'"
      :page="1"
      :items-per-page="solicitations?.length ?? 0"
      :page-count="1"
      :items-count="solicitations?.length ?? 0"
      :is-loading-data="false"
      :solicitations="solicitations"
      :disable-delete="true"
      :disable-edit="true"
      :hide-footer="true"
    />

    <ApplicantSolicitationList
      v-if="isApplicant && table == 'solicitation'"
      :page="1"
      :items-per-page="solicitations?.length ?? 0"
      :page-count="1"
      :items-count="solicitations?.length ?? 0"
      :is-loading-data="false"
      :solicitations="solicitations"
      :hide-footer="true"
    />
    <!-- End Solicitation list -->

    <!-- Applications list -->
    <DonorApplicationList
      v-if="isDonor && table == 'application'"
      :page="1"
      :items-per-page="applications?.length ?? 0"
      :page-count="1"
      :items-count="applications?.length ?? 0"
      :is-loading-data="false"
      :applications="applications"
      :disable-delete="true"
      :disable-edit="true"
      :hide-footer="true"
    />

    <ApplicantApplicationList
      v-if="isApplicant && table == 'application'"
      :page="1"
      :items-per-page="applications?.length ?? 0"
      :page-count="1"
      :items-count="applications?.length ?? 0"
      :is-loading-data="false"
      :applications="applications"
      :hide-footer="true"
    />
    <!-- End applications list -->

    <!-- Projects list -->
    <DonorProjectList
      v-if="isDonor && table == 'project'"
      :page="1"
      :items-per-page="projects?.length ?? 0"
      :page-count="1"
      :items-count="projects?.length ?? 0"
      :is-loading-data="false"
      :projects="projects"
      :disable-delete="true"
      :disable-edit="true"
      :hide-footer="true"
    />

    <ApplicantProjectList
      v-if="isApplicant && table == 'project'"
      :page="1"
      :items-per-page="projects?.length ?? 0"
      :page-count="1"
      :items-count="projects?.length ?? 0"
      :is-loading-data="false"
      :projects="projects"
      :disable-delete="true"
      :disable-edit="true"
      :hide-footer="true"
    />
    <!-- End projects list -->

    <!-- Report list -->
    <DonorReportList
      v-if="isDonor && table == 'reports'"
      :page="1"
      :items-per-page="reports?.length ?? 0"
      :page-count="1"
      :items-count="reports?.length ?? 0"
      :is-loading-data="false"
      :reports="reports"
      :disable-delete="true"
      :disable-edit="true"
      :hide-footer="true"
    />

    <ApplicantReportList
      v-if="isApplicant && table == 'reports'"
      :page="1"
      :items-per-page="reports?.length ?? 0"
      :page-count="1"
      :items-count="reports?.length ?? 0"
      :is-loading-data="false"
      :reports="reports"
      :disable-delete="true"
      :hide-footer="true"
    />
    <!-- End reports list -->
  </v-container>
</template>

<script setup lang="ts">
import { useSearchStore } from "@/store/searchStore";
import { storeToRefs } from "pinia";
import PageHeader from "../components/others/PageHeader.vue";
import { useAuthStore } from "@/store/authStore";
import { Programs } from "@/models/Program";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Solicitations } from "@/models/Solicitation";
import { Applications } from "@/models/Application";
import { Projects } from "@/models/Project";
import { Reports } from "@/models/Report";
import ZeroSearchResults from "./components/ZeroSearchResults.vue";
import { defineAsyncComponent } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const DonorProgramList = defineAsyncComponent(
  () => import("../program/components/DonorProgramList.vue")
);
const ApplicantProgramList = defineAsyncComponent(
  () => import("../program/components/ApplicantProgramList.vue")
);

const DonorSolicitationList = defineAsyncComponent(
  () => import("../solicitation/components/DonorSolicitationList.vue")
);
const ApplicantSolicitationList = defineAsyncComponent(
  () => import("../solicitation/components/ApplicantSolicitationList.vue")
);

const DonorApplicationList = defineAsyncComponent(
  () => import("../application/components/DonorApplicationList.vue")
);
const ApplicantApplicationList = defineAsyncComponent(
  () => import("../application/components/ApplicantApplicationList.vue")
);

const DonorProjectList = defineAsyncComponent(
  () => import("@/views/project/components/DonorProjectList.vue")
);
const ApplicantProjectList = defineAsyncComponent(
  () => import("@/views/project/components/ApplicantProjectList.vue")
);

const DonorReportList = defineAsyncComponent(
  () => import("@/views/report/components/DonorReportList.vue")
);
const ApplicantReportList = defineAsyncComponent(
  () => import("@/views/report/components/ApplicantReportList.vue")
);

const searchStore = useSearchStore();
const { table, results } = storeToRefs(searchStore);
const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);
const route = useRoute();
const { t } = useI18n();

const programs = computed(() => {
  if (table.value == "program") return results.value as Programs;
});

const solicitations = computed(() => {
  if (table.value == "solicitation") return results.value as Solicitations;
});

const applications = computed(() => {
  if (table.value == "application") return results.value as Applications;
});

const projects = computed(() => {
  if (table.value == "project") return results.value as Projects;
});

const reports = computed(() => {
  if (table.value == "reports") return results.value as Reports;
});

const pageTitle = computed(() => {
  switch (table.value) {
    case "program":
      return `${t("advSearchResults")} ${t("on")} ${t("programs")}`;

    case "solicitation":
      return `${t("advSearchResults")} ${t("on")} ${t("solicitations")}`;

    case "application":
      return `${t("advSearchResults")} ${t("on")} ${t("applications")}`;

    case "project":
      return `${t("advSearchResults")} ${t("on")} ${t("projects")}`;

    case "reports":
      return `${t("advSearchResults")} ${t("on")} ${t("reports")}`;

    default:
      return t("advSearchResults");
  }
});
</script>

<style scoped></style>
