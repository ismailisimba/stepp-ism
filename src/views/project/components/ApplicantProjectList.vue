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
      <ApplicantActionBtn
        @click="
          router.push({ name: 'projects.show', params: { projectId: item.id } })
        "
        :text="t('view')"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Projects } from "@/models/Project";
import router from "@/router";
import { formatCurrency } from "@/helpers/numberFormats";
import { formatAsShortDate } from "@/helpers/dateFormats";
import { strToSlug } from "@/helpers/general";
import ApplicantActionBtn from "@/views/components/buttons/ApplicantActionBtn.vue";

const { t } = useI18n();

const headers = [
  { title: t("name"), key: "name", sortable: false, width: "40%" },
  { title: t("startDate"), key: "startDate", sortable: false, width: "14%" },
  { title: t("endDate"), key: "endDate", sortable: false, width: "14%" },
  { title: t("budget"), key: "budgetUSD", sortable: false, width: "10%" },
  { title: t("status"), key: "status", sortable: false, width: "10%" },
  { title: t("actions"), key: "actions", sortable: false, width: "10%" },
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
    projects?: Projects;
    isLoadingData: boolean;
    page: number;
    itemsPerPage: number;
    pageCount: number;
    itemsCount: number;
    sortBy?: string;
    showAlerts?: boolean;
    hideFooter?: boolean; 
  }>(),
  {
    isLoadingData: false,
    sortBy: "created_date",
    showAlerts: false,
    hideFooter: false
  }
);
</script>

<style scoped></style>
