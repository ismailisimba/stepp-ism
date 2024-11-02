<template>
  <v-list link density="comfortable" lines="one">
    <v-list-item
      v-for="program in programs"
      value=""
      :active-class="''"
      class="py-2 px-2"
      :title="program.name"
      :subtitle="program.description"
      @click="goToPage(program)"
    ></v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { Program, Programs } from "@/models/Program";
import router from "@/router";

const props = defineProps<{
  programs: Programs;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const goToPage = (program: Program) => {
  emit("close");
  router.push({ name: "programs.show", params: { programId: program.id } });
};
</script>

<style scoped>
.v-list-item--active {
  background-color: transparent !important;
}
</style>
