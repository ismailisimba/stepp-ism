<template>
  <v-list link density="comfortable" lines="one">
    <v-list-item
      v-for="project in projects"
      value=""
      :active-class="''"
      class="py-2 px-2"
      :title="project.name"
      :subtitle="project.description"
      @click="goToPage(project)"
    ></v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { Project, Projects } from "@/models/Project";
import router from "@/router";

const props = defineProps<{
  projects: Projects;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const goToPage = (project: Project) => {
  emit("close");
  router.push({ name: "projects.show", params: { projectId: project.id } });
};
</script>

<style scoped>
.v-list-item--active {
  background-color: transparent !important;
}
</style>
