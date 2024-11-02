<template>
  <v-list link density="comfortable" lines="one">
    <v-list-item
      v-for="report in reports"
      value=""
      :active-class="''"
      class="py-2 px-2"
      :title="report.name"
      :subtitle="report.description"
      @click="goToPage(report)"
    ></v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { Report, Reports } from "@/models/Report";
import router from "@/router";

const props = defineProps<{
  reports: Reports;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const goToPage = (report: Report) => {
  emit("close");
  router.push({ name: "reports.show", params: { reportId: report.id } });
};
</script>

<style scoped>
.v-list-item--active {
  background-color: transparent !important;
}
</style>
