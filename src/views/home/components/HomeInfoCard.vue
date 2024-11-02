<template>
  <v-card :to="info.to" elevation="0" max-width="280" max-height="100">
    <v-card-text class="bg-grey-lighten-3 ma-0 pa-0">
      <v-row align="center" no-gutters>
        <v-col cols="8">
          <v-sheet class="bg-transparent">
            <p class="text-subtitle-2 px-4">{{ info.name }}</p>
            <p class="text-h6 px-4">{{ formatNumber(info.count, 0) }}</p>
          </v-sheet>
        </v-col>
        <v-col
          class="text-center bg-primary w-100 h-100 pa-0 ma-0"
          bg-color="primary"
          cols="4"
        >
          <v-card flat class="bg-transparent">
            <v-icon :icon="info.icon" size="80"></v-icon>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { formatNumber } from "@/helpers/numberFormats";
import { RouteLocation } from "vue-router";

const props = defineProps<{
  info: { name: string; count: number; icon: string; to?: RouteLocation };
}>();
</script>

<style scoped></style>
