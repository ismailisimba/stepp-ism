<template>
  <v-card
    class="ma-auto pl-4 rounded-pill"
    min-width="190"
    max-width="240"
    min-height="80"
    max-height="80"
    :color="bgColor"
  >
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" class="text-caption text-uppercase">
          {{ title }}:
        </v-col>
        <v-col cols="12" class="text-h6 text-uppercase">
          {{ subtitle }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  bgColor: string;
}>();
</script>

<style scoped></style>
