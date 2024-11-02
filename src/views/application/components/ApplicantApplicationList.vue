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
    <!-- Name Column -->
    <template v-slot:item.name="{ item }">
      <div :class="`status ${item.status}`">
        <span class="pl-3">{{ item.name }}</span>
      </div>
    </template>

    <!-- Program name Column -->
    <template v-slot:item.programName="{ item }">
      <RouterLink
        :to="{ name: 'programs.show', params: { programId: item.programId } }"
      >
        <span class="text-capitalize">{{ item.programName.trim() }}</span>
      </RouterLink>
    </template>

    <!-- Solicitation name Column -->
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

    <!-- Status Column -->
    <template v-slot:item.status="{ value }">
      <span class="text-capitalize">{{ value.trim() }}</span>
    </template>

    <!-- Action -->
    <template v-slot:item.actions="{ item }">
      <ApplicantActionBtn
        @click="
          router.push({ name: 'applications.show', params: { appId: item.id } })
        "
        :text="t('view')"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { Applications } from "@/models/Application";
import router from "@/router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import ApplicantActionBtn from "@/views/components/buttons/ApplicantActionBtn.vue";
const { t } = useI18n();

const headers = [
  //{ title: t("name"), key: "name", sortable: false },
  {
    title: t("programName"),
    key: "programName",
    sortable: false,
    width: "35%",
  },
  {
    title: t("solicitationName"),
    key: "solicitationName",
    sortable: false,
    width: "35%",
  },
  { title: t("status"), key: "status", sortable: false, width: "15%" },
  { title: t("actions"), key: "actions", sortable: false, width: "15%" },
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
    applications?: Applications;
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
    hideFooter: false,
  }
);
</script>

<style scoped></style>
