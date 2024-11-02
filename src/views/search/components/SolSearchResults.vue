<template>
  <v-list link density="comfortable" lines="one">
    <v-list-item
      v-for="sol in solicitations"
      value=""
      :active-class="''"
      class="py-2 px-2"
      :title="sol.name"
      :subtitle="sol.description"
      @click="goToPage(sol)"
    ></v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { Solicitation, Solicitations } from "@/models/Solicitation";
import router from "@/router";

const props = defineProps<{
  solicitations: Solicitations;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const goToPage = (sol: Solicitation) => {
  emit("close");
  router.push({ name: "solicitations.show", params: { solId: sol.id } });
};
</script>

<style scoped>
.v-list-item--active {
  background-color: transparent !important;
}
</style>
