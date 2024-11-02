<template>
  <v-data-table-server
    density="default"
    v-model:items-per-page="perPage"
    :headers="headers"
    :items="solicitations"
    :items-length="itemsCount"
    :loading="isLoadingData"
    :hide-default-footer="hideFooter"
    loading-text="loadingSolicitations"
    @update:options="(val : any) => $emit('update', val)"
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
    <template v-slot:item.fundingPerProjectUSD="{ value }">
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
        @click.prevent="updateItem(item.id)"
      >
        mdi-file-edit-outline
      </v-icon>
      <v-icon
        v-if="!disableView"
        color="primary"
        class="me-2"
        size="x-large"
        @click="goToShowPage(item.id)"
      >
        mdi-eye-outline
      </v-icon>
      <v-icon
        v-if="!disableDelete"
        color="primary"
        class="me-2"
        size="x-large"
        @click="deleteItem(item.id, item.name)"
      >
        mdi-close
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
import { useI18n } from "vue-i18n";
import { formatCurrency } from "@/helpers/numberFormats";
import { Solicitations } from "@/models/Solicitation";
import { computed } from "vue";
import apiEndpoints from "@/constants/endpoints";
import DeleteDialog from "@/views/components/DeleteDialog.vue";
import { ref } from "vue";
import router from "@/router";
import { formatAsShortDate } from "@/helpers/dateFormats";
import { strToSlug } from "@/helpers/general";

const { t } = useI18n();

//Define props
const props = withDefaults(
  defineProps<{
    solicitations?: Solicitations;
    isLoadingData: boolean;
    page: number;
    itemsPerPage: number;
    pageCount: number;
    itemsCount: number;
    sortBy?: string;
    disableEdit?: boolean;
    disableDelete?: boolean;
    disableView?: boolean;
    hideFooter?: boolean;
  }>(),
  {
    isLoadingData: false,
    sortBy: "created_date",
    disableEdit: false,
    disableDelete: false,
    disableView: false,
    hideFooter: false,
  }
);

// Define emits
const emit = defineEmits<{
  (e: "update", payload: any): void;
  (e: "updateItemPerPage", payload: number): void;
  (e: "onDelete", payload: any): void;
  (e: "onDeleteFail", payload: any): void;
}>();

//Computed
const perPage = computed({
  get() {
    return props.itemsPerPage;
  },
  set(val: any) {
    emit("updateItemPerPage", val);
  },
});

//Table
const headers = [
  { title: t("name"), key: "name", sortable: false, width: "38%" },
  { title: t("startDate"), key: "startDate", sortable: false, width: "13%" },
  { title: t("endDate"), key: "endDate", sortable: false, width: "13%" },
  {
    title: t("fundingPerProjectUSD"),
    key: "fundingPerProjectUSD",
    sortable: false,
    width: "10%",
  },
  { title: t("status"), key: "status", sortable: false, width: "9%" },
  { title: t("actions"), key: "actions", sortable: false, width: "17%" },
];

//GO TO SHOW PAGE
const goToShowPage = (id: string) => {
  router.push({ name: "solicitations.show", params: { solId: id } });
};

//DELETE
const showDeleteDialog = ref(false);
const deleteUrl = ref("");
const deleteItemName = ref("");
const deleteItemId = ref("");

const deleteItem = (itemId: string, itemName: string) => {
  deleteUrl.value = apiEndpoints.solicitationsDelete;
  deleteItemName.value = itemName;
  deleteItemId.value = itemId;
  showDeleteDialog.value = true;
};

const updateItem = (itemId: string) => {
  router.push({
    name: "solicitations.edit",
    params: {
      solId: itemId,
    },
  });
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
