<template>
  <v-container fluid class="pa-8">
    <ReportDonorGraphs v-if="isDonor" />
    <v-row class="pb-3">
      <v-col>
        <PageHeader :text="$t('reports')" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="d-flex justify-end"> </v-col>
    </v-row>

    <DonorReportList
      v-if="isDonor"
      :page="page"
      :items-per-page="itemsPerPage"
      :page-count="pageCount"
      :items-count="totalItems"
      :is-loading-data="loadingData"
      :reports="reports"
      @updateList="loadItems"
      @update-item-per-page="(val : number) => (itemsPerPage = val)"
      @on-delete="onDeleteReport"
      @on-delete-fail="onDeleteReportFail"
    />

    <ApplicantReportList
      v-if="isApplicant"
      :page="page"
      :items-per-page="itemsPerPage"
      :page-count="pageCount"
      :items-count="totalItems"
      :is-loading-data="loadingData"
      :reports="reports"
      @updateList="loadItems"
      @update-item-per-page="(val : number) => (itemsPerPage = val)"
    />
  </v-container>

  <Snackbar
    :show="snackBarShow"
    :color="snackBarColor"
    :message="snackBarMessage"
  />
</template>

<script setup lang="ts">
import { appConstants } from "@/constants/app_constants";
import { OrderType, SnackbarColor } from "@/types/types";
import { ref } from "vue";
import PageHeader from "../components/others/PageHeader.vue";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { defineAsyncComponent } from "vue";
import { Reports } from "@/models/Report";
import { getReports } from "@/services/report_service";
import { useI18n } from "vue-i18n";
import ReportDonorGraphs from "./components/ReportDonorGraphs.vue";

const DonorReportList = defineAsyncComponent(
  () => import("./components/DonorReportList.vue")
);
const ApplicantReportList = defineAsyncComponent(
  () => import("./components/ApplicantReportList.vue")
);
const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);

const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);
const { t } = useI18n();

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

//SNACKBAR
const hideSnackBar = async () => {
  snackBarMessage.value = "";
  snackBarShow.value = false;
};

const showSnackBar = (color: SnackbarColor, message: string) => {
  snackBarColor.value = color;
  snackBarMessage.value = message;
  snackBarShow.value = true;
};

//END DELETE

const page = ref(0);
const orderByColumn = ref("created_date");
const itemsPerPage = ref(appConstants.pagination);
const pageCount = ref(0);
const totalItems = ref(0);
const loadingData = ref(false);

const reports = ref<Reports>();

//Delete
const onDeleteReport = (res: any) => {
  let success = res.success || false;
  let reportId = res.id || 0;

  if (success && reportId != 0) {
    reports.value = reports.value?.filter((i) => i.id !== reportId);
    showSnackBar("success", t("reportDeletedMessage"));
  } else {
    onDeleteReportFail();
  }
};

const onDeleteReportFail = () => {
  showSnackBar("error", t("generalErrorMessage"));
};

const loadItems = ({
  page,
  itemsPerPage,
  sortBy = orderByColumn.value,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: string;
}) => {
  load(page, itemsPerPage, sortBy, "ASC");
};

const load = async (
  pageToLoad: number,
  pageItemsNum: number,
  orderBy: string,
  orderType: OrderType
) => {
  try {
    loadingData.value = true;
    await getReports(
      pageToLoad,
      pageItemsNum,
      orderByColumn.value,
      orderType
    ).then((data) => {
      reports.value = data.items;
      page.value = data.paginationData.currentPage;
      pageCount.value = data.paginationData.numberOfPages;
      itemsPerPage.value = data.paginationData.itemsPerPage;
      totalItems.value = data.paginationData.totalNumOfItems;
      loadingData.value = false;
    });
  } catch (error) {
    loadingData.value = false;
    throw error;
  }
};
</script>
