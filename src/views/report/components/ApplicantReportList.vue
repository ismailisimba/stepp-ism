<template>
  <v-data-table-server
    mobile-breakpoint="sm"
    v-model:items-per-page="perPage"
    :headers="headers"
    :items="reports"
    :items-length="itemsCount"
    :loading="isLoadingData"
    loading-text="loadingReports"
    :hide-default-footer="hideFooter"
    @update:options="(val : any) => $emit('updateList', val)"
  >
    <!-- Name Column -->
    <template v-slot:item.name="{ item }">
      {{ item.name }}
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
    <template v-slot:item.budgetUSD="{ value }">
      {{ formatCurrency(value) }}
    </template>

    <!-- Status Column -->
    <template v-slot:item.status="{ value }">
      <span class="text-capitalize">{{ value.trim() }}</span>
    </template>

    <!-- Action -->
    <template v-slot:item.actions="{ item }">
      <ApplicantActionBtn
        @click="
          router.push({name: 'reports.update', params: { reportId: item.id } })
        "
        :text="t('edit')"
      />

      <ApplicantActionBtn
        @click="
          router.push({name: 'report.show', params: { reportId: item.id } })
        "
        :text="t('view')"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { SnackbarColor } from "@/types/types";
import router from "@/router";
import { formatCurrency } from "@/helpers/numberFormats";
import { Reports } from "@/models/Report";
import { formatAsShortDate } from "@/helpers/dateFormats";

const { t } = useI18n();

const headers = [
  { title: t("name"), key: "name", sortable: false, width: "45%" },
  { title: t("startDate"), key: "startDate", sortable: false, width: "13%" },
  { title: t("endDate"), key: "endDate", sortable: false, width: "12%" },
  { title: t("status"), key: "status", sortable: false, width: "10%" },
  { title: t("actions"), key: "actions", sortable: false, width: "20%" },
];

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
  (e: "updateItemPerPage", payload: number): void;
}>();

const props = withDefaults(
  defineProps<{
    reports?: Reports;
    isLoadingData: boolean;
    page: number;
    itemsPerPage: number;
    pageCount: number;
    itemsCount: number;
    sortBy?: string;
    showAlerts?: boolean;
    disableEdit?: boolean;
    disableView?: boolean;
    hideFooter?: boolean; 
  }>(),
  {
    isLoadingData: false,
    sortBy: "created_date",
    showAlerts: false,
    disableEdit: false,
    disableView: false,
    hideFooter: false
  }
);
</script>

<style scoped></style>
