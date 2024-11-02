<template>
  <v-list link density="comfortable" lines="one">
    <v-list-item
      v-for="app in applications"
      value=""
      :active-class="''"
      class="py-2 px-2"
      :title="app.name"
      :subtitle="app.programName"
      @click="goToPage(app)"
    ></v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { Applications, Application } from "@/models/Application";
import router from "@/router";

const props = defineProps<{
  applications: Applications;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const goToPage = (app: Application) => {
  emit("close");
  router.push({ name: "applications.show", params: { appId: app.id } });
};
</script>

<style scoped>
.v-list-item--active {
  background-color: transparent !important;
}
</style>
