<template>
  <v-data-table-server
    mobile-breakpoint="sm"
    v-model:items-per-page="perPage"
    :headers="headers"
    :items="applications"
    :items-length="itemsCount"
    :loading="isLoadingData"
    loading-text="loadingApps"
    :hide-default-footer="hideFooter"
    @update:options="(val : any) => $emit('updateList', val)"
  >
    <!-- Program Name Column -->
    <template v-slot:item.programName="{ item }">
      <RouterLink
        :to="{ name: 'programs.show', params: { programId: item.programId } }"
      >
        <div :class="`status ${item.status}`">
          <span class="pl-3 text-capitalize">{{ item.programName.trim() }}</span>
        </div>
      </RouterLink>
    </template>

    <!-- Solicitation Name Column -->
    <template v-slot:item.solicitationName="{ item }">
      <RouterLink
        :to="{
          name: 'solicitations.show',
          params: { solId: item.solicitationId },
        }"
      >
        <span class="text-capitalize">{{ item.solicitationName.trim() }}</span>
      </RouterLink>
    </template>

    <!-- Application Review Status Column -->
    <template v-slot:item.applicationReviewStatus="{ value }">
      <span class="text-capitalize">{{ value !== null? value.trim() : 'N/A'  }}</span>
    </template>

    <!-- Rank Column -->
    <template v-slot:item.rank="{ value }">
      <span>{{ value !== null? value : 'N/A' }}</span>
    </template>

    <!-- Status Column -->
    <template v-slot:item.status="{ value }">
      <span class="text-capitalize">{{ value.trim() }}</span>
    </template>

    <!-- Actions Column -->
    <template v-slot:item.actions="{ item }">
      <v-icon
        color="primary"
        class="me-2"
        size="x-large"
        @click="
          router.push({ name: 'applications.show', params: { appId: item.id } })
        "
      >
        mdi-eye-outline
      </v-icon>
    </template>
  </v-data-table-server>

  <!-- Delete Modal -->
  <delete-dialog
    :delete-url="deleteUrl"
    :item-id="deleteItemId"
    :item-name="deleteItemName"
    :show="showDeleteDialog"
    @close="showDeleteDialog = false"
    @deleted="onDeleteSuccess"
    @failed="onDeleteSuccessFail"
  />
  <!-- End delete Modal -->
</template>

<script setup lang="ts">
import { Applications } from "@/models/Application";
import DeleteDialog from "@/views/components/DeleteDialog.vue";
import router from "@/router";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import apiEndpoints from "@/constants/endpoints";

const { t } = useI18n();

const headers = [
  {
    title: t("programName"),
    key: "programName",
    sortable: false,
    width: "20%",
  },
  {
    title: t("solicitationName"),
    key: "solicitationName",
    sortable: false,
    width: "20%",
  },
  {
    title: t("applicationReviewStatus"),
    key: "applicationReviewStatus",
    sortable: false,
    width: "20%",
  },
  {
    title: t("rank"),
    key: "rank",
    sortable: false,
    width: "10%",
  },
  { title: t("status"), key: "status", sortable: false, width: "15%" },
  { title: t("actions"), key: "actions", sortable: false, width: "15%" },
];

// Computed
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
    applications?: Applications;
    isLoadingData: boolean;
    page: number;
    itemsPerPage: number;
    pageCount: number;
    itemsCount: number;
    sortBy?: string;
    disableView?: boolean;
    hideFooter?: boolean;
  }>(),
  {
    isLoadingData: false,
    sortBy: "created_date",
    disableView: false,
    hideFooter: false,
  }
);

// DELETE
const showDeleteDialog = ref(false);
const deleteUrl = ref("");
const deleteItemName = ref("");
const deleteItemId = ref("");

const deleteItem = (itemId: string, itemName: string) => {
  console.log(itemId);
  deleteUrl.value = apiEndpoints.applicationDelete;
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
</script>
