<template>
  <v-container fluid>
    <SolicitationDonorGraphs v-if="isDonor" />
    <v-row class="pb-3">
      <v-col>
        <PageHeader :text="$t('solicitations')" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="d-flex justify-end">
        <PageHeaderBtn
          v-if="isDonor"
          color="primary"
          icon="mdi-plus-circle"
          @click="router.push({ name: 'solicitations.create' })"
          :text="$t('addSolicitation')"
        />
      </v-col>
    </v-row>

    <!-- List -->
    <DonorSolicitationList
      v-if="isDonor"
      :page="page"
      :items-per-page="itemsPerPage"
      :page-count="pageCount"
      :items-count="totalItems"
      :is-loading-data="loadingData"
      :solicitations="solicitations"
      @update="loadItems"
      @update-item-per-page="(val) => (itemsPerPage = val)"
      @on-delete="onDeleteSolicitation"
      @on-delete-fail="onDeleteSolicitationFail"
    />

    <ApplicantSolicitationList
      v-if="isApplicant"
      :page="page"
      :items-per-page="itemsPerPage"
      :page-count="pageCount"
      :items-count="totalItems"
      :is-loading-data="loadingData"
      :solicitations="solicitations"
      @update="loadItems"
      @update-item-per-page="(val) => (itemsPerPage = val)"
    />
    <!-- End List -->
  </v-container>

  <!-- Toast -->
  <Snackbar
    :show="snackBarShow"
    :color="snackBarColor"
    :message="snackBarMessage"
  />
  <!-- End Toast -->
</template>

<script setup lang="ts">
import { appConstants } from "@/constants/app_constants";
import { Solicitations } from "@/models/Solicitation";
import { OrderType, SnackbarColor } from "@/types/types";
import { defineAsyncComponent, ref } from "vue";
import { getAll } from "@/services/solicitation_service";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import SolicitationDonorGraphs from "./components/SolicitationDonorGraphs.vue";
const DonorSolicitationList = defineAsyncComponent(
  () => import("./components/DonorSolicitationList.vue")
);

const ApplicantSolicitationList = defineAsyncComponent(
  () => import("./components/ApplicantSolicitationList.vue")
);

const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);

const { t } = useI18n();

const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);

//Table
const page = ref(0);
const orderByColumn = ref("created_date");
const itemsPerPage = ref(appConstants.pagination);
const pageCount = ref(0);
const totalItems = ref(0);
const loadingData = ref(false);
//End table vars

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

const solicitations = ref<Solicitations>();

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

//Delete
const onDeleteSolicitation = (res: any) => {
  let success = res.success || false;
  let solicitationId = res.id || 0;

  if (success && solicitationId != 0) {
    solicitations.value = solicitations.value?.filter(
      (sol) => sol.id !== solicitationId
    );

    snackBarColor.value = "success";
    snackBarMessage.value = t("solicitationDeletedMessage");
    snackBarShow.value = true;
  } else {
    onDeleteSolicitationFail();
  }
};

const onDeleteSolicitationFail = () => {
  snackBarShow.value = true;
  snackBarColor.value = "error";
  snackBarMessage.value = t("generalErrorMessage");
};

// Get solicitations from backend
const load = async (
  pageToLoad: number,
  pageItemsNum: number,
  orderBy: string,
  orderType: OrderType
) => {
  try {
    loadingData.value = true;
    await getAll(pageToLoad, pageItemsNum, orderByColumn.value, orderType).then(
      (data) => {
        solicitations.value = data.items;
        page.value = data.paginationData.currentPage;
        pageCount.value = data.paginationData.numberOfPages;
        itemsPerPage.value = data.paginationData.itemsPerPage;
        totalItems.value = data.paginationData.totalNumOfItems;
        loadingData.value = false;
      }
    );
  } catch (error) {
    loadingData.value = false;
    throw error;
  }
};
</script>
