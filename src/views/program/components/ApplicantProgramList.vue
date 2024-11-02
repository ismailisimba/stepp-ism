<template>
  <v-data-table-server
    mobile-breakpoint="sm"
    v-model:items-per-page="perPage"
    :headers="headers"
    :items="programs"
    :items-length="itemsCount"
    :loading="isLoadingData"
    :hide-default-footer="hideFooter"
    loading-text="loadingProgramsMessage"
    @update:options="(val : any) => $emit('updateList', val)"
  >
    <!-- Name Column -->
    <template v-slot:item.name="{ item }">
      <div :class="`status ${item.status}`">
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
      <ApplicantActionBtn
        v-if="!disableView"
        @click="
          router.push({ name: 'programs.show', params: { programId: item.id } })
        "
        :text="t('view')"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/helpers/numberFormats";
import { Programs } from "@/models/Program";
import router from "@/router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ApplicantActionBtn from "@/views/components/buttons/ApplicantActionBtn.vue";
import { formatAsShortDate } from "@/helpers/dateFormats";

const { t } = useI18n();

const headers = [
  { title: t("name"), key: "name", sortable: false },
  { title: t("startDate"), key: "startDate", sortable: false },
  { title: t("endDate"), key: "endDate", sortable: false },
  { title: t("fundingUSD"), key: "fundingUSD", sortable: false },
  { title: t("actions"), key: "actions", sortable: false },
];

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
    programs?: Programs;
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
</script>

<style scoped></style>
