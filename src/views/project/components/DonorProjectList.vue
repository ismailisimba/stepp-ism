<template>
  <v-data-table-server
    mobile-breakpoint="sm"
    v-model:items-per-page="perPage"
    :headers="headers"
    :items="projects"
    :items-length="itemsCount"
    :loading="isLoadingData"
    loading-text="loadingProjects"
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
    <template v-slot:item.budgetUSD="{ value }">
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
        @click="
          router.push({
            name: 'projects.edit',
            params: { projectAnswersUrl: item.projectAnswersUrl },
          })
        "
      >
      </v-icon>
      <v-icon
        v-if="!disableView"
        color="primary"
        class="me-2"
        size="x-large"
        icon="mdi-eye-outline"
        @click="
          router.push({ name: 'projects.show', params: { projectId: item.id } })
        "
      >
      </v-icon>
      <v-icon
        v-if="!disableDelete"
        color="primary"
        class="me-2"
        size="x-large"
        icon="mdi-close"
        @click="deleteItem(item.id, item.name)"
      >
      </v-icon>
    </template>
  </v-data-table-server>

  <delete-dialog
    :delete-url="deleteUrl"
    :item-id="deleteItemId"
    :item-name="deleteItemName"
    :show="showDeleteDialog"
    @close="showDeleteDialog = false"
    @deleted="onDeleteSuccess"
    @failed="onDeleteSuccessFail"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Projects } from "@/models/Project";
import router from "@/router";
import { formatCurrency } from "@/helpers/numberFormats";
import { formatAsShortDate } from "@/helpers/dateFormats";
import { strToSlug } from "@/helpers/general";
import apiEndpoints from "@/constants/endpoints";
import { defineAsyncComponent } from "vue";
const DeleteDialog = defineAsyncComponent(
  () => import("@/views/components/DeleteDialog.vue")
);

const { t } = useI18n();

const headers = [
  { title: t("name"), key: "name", sortable: false, width: "39%" },
  { title: t("startDate"), key: "startDate", sortable: false, width: "13%" },
  { title: t("endDate"), key: "endDate", sortable: false, width: "13%" },
  { title: t("budget"), key: "budgetUSD", sortable: false, width: "10%" },
  { title: t("status"), key: "status", sortable: false, width: "10%" },
  { title: t("actions"), key: "actions", sortable: false, width: "15%" },
];

//DELETE
const showDeleteDialog = ref(false);
const deleteUrl = ref("");
const deleteItemName = ref("");
const deleteItemId = ref("");

const deleteItem = (itemId: string, itemName: string) => {
  deleteUrl.value = apiEndpoints.projectDelete;
  deleteItemName.value = itemName;
  deleteItemId.value = itemId;
  showDeleteDialog.value = true;
};

const onDeleteSuccess = (val: any) => {
  emit("onDelete", val);
  showDeleteDialog.value = false;
};

const onDeleteSuccessFail = (val: any) => {
  emit("onDeleteFail", val);
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
  (e: "updateItemPerPage", payload: number): void;
  (e: "onDelete", payload: any): void;
  (e: "onDeleteFail", payload: any): void;
}>();

const props = withDefaults(
  defineProps<{
    projects?: Projects;
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

<style scoped></style>
