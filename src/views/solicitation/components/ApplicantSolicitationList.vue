<template>
  <v-data-table-server
    density="default"
    v-model:items-per-page="perPage"
    :headers="headers"
    :items="solicitations"
    :items-length="itemsCount"
    :loading="isLoadingData"
    loading-text="loadingSolicitations"
    :hide-default-footer="hideFooter"
    @update:options="(val : any) => $emit('update', val)"
  >
    <!-- Name Column -->
    <template v-slot:item.name="{ item }">
      <span class="pl-3">{{ item.name }}</span>
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
      <ApplicantActionBtn
        @click="
          router.push({
            name: 'solicitations.show',
            params: { solId: item.id },
          })
        "
        :text="t('view')"
      />
      <ApplicantActionBtn
        @click="
          router.push({
            name: 'solicitations.apply',
            params: { solId: item.id },
          })
        "
        :text="t('apply')"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { formatCurrency } from "@/helpers/numberFormats";
import { Solicitations } from "@/models/Solicitation";
import { computed } from "vue";
import router from "@/router";
import ApplicantActionBtn from "@/views/components/buttons/ApplicantActionBtn.vue";
import { formatAsShortDate } from "@/helpers/dateFormats";

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
    hideFooter?: boolean; 
  }>(),
  {
    isLoadingData: false,
    sortBy: "created_date",
    hideFooter: false
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
  { title: t("name"), key: "name", sortable: false, width: "40%" },
  { title: t("startDate"), key: "startDate", sortable: false, width: "13%" },
  { title: t("endDate"), key: "endDate", sortable: false, width: "12%" },
  {
    title: t("fundingPerProjectUSD"),
    key: "fundingPerProjectUSD",
    sortable: false,
    width: "16%",
  },
  { title: t("actions"), key: "actions", sortable: false, width: "19%" },
];
</script>
