<template>
  <v-container fluid class="pa-8">
    <ProgramDonorGraphs v-if="isDonor" />
    <v-spacer></v-spacer>
    <v-row class="pb-3">
      <v-col>
        <PageHeader :text="$t('programs')" />
      </v-col>
      <v-spacer></v-spacer>

      <v-col class="d-flex justify-end">
        <PageHeaderBtn
          v-if="isDonor"
          color="primary"
          icon="mdi-plus-circle"
          @click="router.push({ name: 'programs.create' })"
          :text="$t('addProgram')"
        />
      </v-col>
    </v-row>

    <DonorProgramList
      v-if="isDonor"
      :page="page"
      :items-per-page="itemsPerPage"
      :page-count="pageCount"
      :items-count="totalItems"
      :is-loading-data="loadingData"
      :programs="programs"
      @updateList="loadItems"
      @update-item-per-page="(val : number) => (itemsPerPage = val)"
      @updateProgram="updateProgram"
      @removeProgram="removeProgram"
    />

    <ApplicantProgramList
      v-if="isApplicant"
      :page="page"
      :items-per-page="itemsPerPage"
      :page-count="pageCount"
      :items-count="totalItems"
      :is-loading-data="loadingData"
      :programs="programs"
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
import { Program, Programs } from "@/models/Program";
import { get } from "@/services/program_service";
import { OrderType, SnackbarColor } from "@/types/types";
import { ref } from "vue";
import updateItemById from "@/utilities/updateItemById";
import router from "@/router";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { defineAsyncComponent } from "vue";
import ProgramDonorGraphs from "./components/ProgramDonorGraphs.vue";

const DonorProgramList = defineAsyncComponent(
  () => import("./components/DonorProgramList.vue")
);
const ApplicantProgramList = defineAsyncComponent(
  () => import("./components/ApplicantProgramList.vue")
);
const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);

const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

//UPDATE
const updateProgram = (program: Program) => {
  programs.value = updateItemById(programs.value || [], program.id, program);
};
//END UPDATE

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

const removeProgram = (id: string) => {
  programs.value = programs.value?.filter((program) => program.id !== id);
};

//END DELETE

const page = ref(0);
const orderByColumn = ref("created_date");
const itemsPerPage = ref(appConstants.pagination);
const pageCount = ref(0);
const totalItems = ref(0);
const loadingData = ref(false);

const programs = ref<Programs>();

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
    await get(pageToLoad, pageItemsNum, orderByColumn.value, orderType).then(
      (data) => {
        programs.value = data.items;
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
