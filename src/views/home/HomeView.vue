<template>
  <Loading v-if="isGettingData" />
  <v-container v-else fluid>
    <v-row>
      <v-col cols="12">
        <PageHeader :text="$t('workspace')" />
      </v-col>
    </v-row>

    <v-row>
      <v-col xs="12" sm="12" md="3" v-for="i in cardsInfo">
        <HomeInfoCard :info="i" />
      </v-col>
    </v-row>

    <br />

    <v-row v-if="isDonor">
      <v-col xs="12" sm="12" md="7">
        <v-card :subtitle="t('TotalNumByStatus')" flat>
          <StatusChart :chartData="statusChartData" />
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
      <v-col xs="12" sm="12" md="4">
        <v-card :subtitle="t('TotalNumItems')" flat>
          <CountChart :chartData="countChartData"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import PageHeader from "../components/others/PageHeader.vue";
import HomeInfoCard from "./components/HomeInfoCard.vue";
import { computed, onMounted, ref } from "vue";
import { homeGraphsData } from "@/services/graph_service";
import Loading from "../components/loaders/default.vue";
import CountChart from "./components/CountChart.vue";
import StatusChart from "./components/StatusChart.vue";
import { useRouter } from "vue-router";
import { colors } from "@/constants/app_constants";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";

const { t } = useI18n();
const isGettingData = ref<boolean>(false);
const data = ref<any>();
const router = useRouter();
const authStore = useAuthStore();
const { isDonor } = storeToRefs(authStore);
const cardsInfo = computed(() => [
  {
    name: t("programs"),
    count: data.value ? data.value.program.total : 0,
    to: router.resolve({ name: "programs" }),
    icon: "mdi-apps",
  },
  {
    name: t("solicitations"),
    count: data.value ? data.value.solicitation.total : 0,
    to: router.resolve({ name: "solicitations" }),
    icon: "mdi-poll",
  },
  {
    name: t("applications"),
    count: data.value ? data.value.application.total : 0,
    to: router.resolve({ name: "applications" }),
    icon: "mdi-email-outline",
  },
  {
    name: t("projects"),
    count: data.value ? data.value.project.total : 0,
    to: router.resolve({ name: "projects" }),
    icon: "mdi-file-cad",
  },
  {
    name: t("reports"),
    count: data.value ? data.value.report.total : 0,
    to: router.resolve({ name: "reports" }),
    icon: "mdi-file-cad",
  },
]);

const countChartData = computed(() => {
  const labels = [
    t("programs"),
    t("solicitations"),
    t("applications"),
    t("projects"),
    t("reports"),
  ];
  const datasets = [
    {
      data: [
        data.value ? data.value.program.count : 0,
        data.value ? data.value.solicitation.count : 0,
        data.value ? data.value.application.count : 0,
        data.value ? data.value.project.count : 0,
        data.value ? data.value.report.count : 0,
      ],
      backgroundColor: [
        colors.program,
        colors.solicitation,
        colors.application,
        colors.project,
        colors.report,
      ],
      hoverOffset: 4,
    },
  ];
  return { labels: labels, datasets: datasets };
});

const statusChartData = computed(() => {
  const labels = [
    t("statuses.inReview"),
    t("statuses.draft"),
    t("statuses.published"),
    t("statuses.inRanking"),
    t("statuses.awarded"),
    t("statuses.inMarking"),
    t("statuses.submitted"),
    t("statuses.created"),
  ];
  const datasets = [
    {
      label: t("programs"),
      backgroundColor: colors.program,
      data: [
        data.value ? data.value.program.inReview || null : null,
        data.value ? data.value.program.draft || null : null,
        data.value ? data.value.program.published || null : null,
        null,
        null,
        null,
        null,
        null,
      ],
    },
    {
      label: t("solicitations"),
      backgroundColor: colors.solicitation,
      data: [
        data.value ? data.value.solicitation.inReview || null : null,
        data.value ? data.value.solicitation.draft || null : null,
        data.value ? data.value.solicitation.published || null : null,
        null,
        null,
        null,
        null,
        null,
      ],
    },
    {
      label: t("applications"),
      backgroundColor: colors.application,
      data: [
        data.value ? data.value.application.inReview || null : null,
        data.value ? data.value.application.draft || null : null,
        data.value ? data.value.application.published || null : null,
        data.value ? data.value.application.inRanking || null : null,
        data.value ? data.value.application.awarded || null : null,
        data.value ? data.value.application.inMarking || null : null,
        data.value ? data.value.application.submitted || null : null,
        data.value ? data.value.application.created || null : null,
      ],
    },
    {
      label: t("projects"),
      backgroundColor: colors.project,
      data: [
        data.value ? data.value.project.inReview || null : null,
        data.value ? data.value.project.draft || null : null,
        data.value ? data.value.project.published || null : null,
        data.value ? data.value.project.inRanking || null : null,
        data.value ? data.value.project.awarded || null : null,
        data.value ? data.value.project.inMarking || null : null,
        data.value ? data.value.project.submitted || null : null,
        data.value ? data.value.project.created || null : null,
      ],
    },
    {
      label: t("reports"),
      backgroundColor: colors.report,
      data: [
        data.value ? data.value.report.inReview || null : null,
        data.value ? data.value.report.draft || null : null,
        data.value ? data.value.report.published || null : null,
        data.value ? data.value.report.inRanking || null : null,
        data.value ? data.value.report.awarded || null : null,
        data.value ? data.value.report.inMarking || null : null,
        data.value ? data.value.report.submitted || null : null,
        data.value ? data.value.report.created || null : null,
      ],
    },
  ];
  return { labels: labels, datasets: datasets };
});

const getData = async () => {
  try {
    isGettingData.value = true;
    await homeGraphsData().then((r) => {
      data.value = r;
      isGettingData.value = false;
    });
  } catch (error) {
    isGettingData.value = false;
    throw error;
  }
};

onMounted(async () => {
  await getData();
});
</script>

<style scoped></style>
