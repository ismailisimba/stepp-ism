<template>
  <v-data-table-server
    mobile-breakpoint="sm"
    v-model:items-per-page="perPage"
    :headers="headers"
    :items="programs"
    :items-length="itemsCount"
    :loading="isLoadingData"
    loading-text="loadingProgramsMessage"
    :hide-default-footer="hideFooter"
    @update:options="(val : any) => $emit('updateList', val)"
  >
    <!-- Name Column -->
    <template v-slot:item.name="{ item }">
      <div :class="`status ${strToSlug(item.status)}`">
        <span class="pl-3">{{ item.name }}</span>
      </div>
    </template>

    <!-- Start date Column -->
    <template v-slot:item.startDate="{ value }">
      {{ formatAsShortDate(value.toDateString()) }}
    </template>

    <!-- End date Column -->
    <template v-slot:item.endDate="{ value }">
      {{ formatAsShortDate(value.toDateString()) }}
    </template>

    <!-- Funding Columns -->
    <template v-slot:item.fundingUSD="{ value }">
      {{ formatCurrency(value) }}
    </template>

    <!-- Status Column -->
    <template v-slot:item.status="{ value }">
      <span class="text-capitalize">{{ value.trim() }}</span>
    </template>

    <!-- Action -->
    <template v-slot:item.actions="{ item }">
      <v-icon
        v-if="!disableEdit"
        color="primary"
        class="me-2"
        size="x-large"
        icon="mdi-file-edit-outline"
        @click="updateProgram(item)"
      >
      </v-icon>
      <v-icon
        v-if="!disableView"
        color="primary"
        class="me-2"
        size="x-large"
        icon="mdi-eye-outline"
        @click="
          router.push({ name: 'programs.show', params: { programId: item.id } })
        "
      >
      </v-icon>
      <v-icon
        v-if="!disableDelete"
        color="primary"
        class="me-2"
        size="x-large"
        icon="mdi-close"
        @click="deleteProgram(item.id, item.name)"
      >
      </v-icon>
    </template>
  </v-data-table-server>

  <PopUpForm
    :program="program"
    :show="showUpdateDialog"
    @succeed="onSuccessUpdate"
    @fail="onFailUpdate"
    @close="showUpdateDialog = false"
  />

  <delete-dialog
    :delete-url="deleteUrl"
    :item-id="deleteItemId"
    :item-name="deleteItemName"
    :show="showDeleteDialog"
    @close="showDeleteDialog = false"
    @deleted="programDeleteSuccess"
    @failed="programDeleteFail"
  />
</template>

<script setup lang="ts">
import { formatCurrency } from "@/helpers/numberFormats";
import { Program, Programs } from "@/models/Program";
import PopUpForm from "../PopUpForm.vue";
import router from "@/router";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { SnackbarColor } from "@/types/types";
import apiEndpoints from "@/constants/endpoints";
import DeleteDialog from "@/views/components/DeleteDialog.vue";
import { formatAsShortDate } from "@/helpers/dateFormats";
import { strToSlug } from "@/helpers/general";

const { t } = useI18n();

const headers = [
  { title: t("name"), key: "name", sortable: false },
  { title: t("startDate"), key: "startDate", sortable: false },
  { title: t("endDate"), key: "endDate", sortable: false },
  { title: t("fundingUSD"), key: "fundingUSD", sortable: false },
  { title: t("status"), key: "status", sortable: false },
  { title: t("actions"), key: "actions", sortable: false },
];

//UPDATE
const program = ref<Program>();
const showUpdateDialog = ref(false);

//DELETE
const showDeleteDialog = ref(false);
const deleteUrl = ref("");
const deleteItemName = ref("");
const deleteItemId = ref("");

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

//END UPDATE

//SNACKBAR
const hideSnackBar = async () => {
  snackBarMessage.value = "";
  snackBarShow.value = false;
};

const showSnackBar = (color: SnackbarColor, message: string) => {
  if (props.showAlerts) {
    snackBarColor.value = color;
    snackBarMessage.value = message;
    snackBarShow.value = true;
  }
};

//Update
const updateProgram = (p: Program) => {
  hideSnackBar();
  program.value = p;
  showUpdateDialog.value = true;
};

const onSuccessUpdate = (program: Program) => {
  emit("updateProgram", program);
  showUpdateDialog.value = false;
  showSnackBar("success", t("programUpdatedMessage"));
};

const onFailUpdate = () => {
  showSnackBar("error", t("generalErrorMessage"));
};

//Delete
const deleteProgram = (programId: string, programName: string) => {
  hideSnackBar();
  deleteUrl.value = apiEndpoints.programDelete;
  deleteItemName.value = programName;
  deleteItemId.value = programId;
  showDeleteDialog.value = true;
};

const programDeleteFail = () => {
  showSnackBar("error", t("generalErrorMessage"));
  showDeleteDialog.value = false;
};

const programDeleteSuccess = (res: any) => {
  let success = res.success || false;
  let programId = res.id || 0;

  if (success && programId != 0) {
    emit("removeProgram", programId);
    showSnackBar("success", t("programDeletedMessage"));
  } else {
    programDeleteFail();
  }
  showDeleteDialog.value = false;
};

//Computed
const perPage = computed({
  get() {
    return props.itemsPerPage;
  },
  set(val: any) {
    emit("updateItemPerPage", val);
  },
});

const emit = defineEmits<{
  (e: "updateList", payload: any): void;
  (e: "updateProgram", payload: Program): void;
  (e: "updateItemPerPage", payload: number): void;
  (e: "removeProgram", payload: string): void;
}>();

const props = withDefaults(
  defineProps<{
    programs?: Programs;
    isLoadingData: boolean;
    page: number;
    itemsPerPage: number;
    pageCount: number;
    itemsCount: number;
    sortBy?: string;
    showAlerts?: boolean;
    disableEdit?: boolean;
    disableDelete?: boolean;
    disableView?: boolean;
    hideFooter?: boolean;
  }>(),
  {
    isLoadingData: false,
    sortBy: "created_date",
    showAlerts: false,
    disableEdit: false,
    disableDelete: false,
    disableView: false,
    hideFooter: false,
  }
);
</script>

<style scoped>
.btn-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
