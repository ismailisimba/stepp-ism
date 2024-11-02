<template>
  <v-container class="fill-height">
    <v-row class="d-flex align-center justify-center">
      <v-col cols="12" class="text-center">
        <v-icon color="grey-lighten-1" :size="200" icon="mdi-text-search">
        </v-icon>
        <p class="text-medium-emphasis">{{ $t("searchResultsMsg") }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts"></script>

<style scoped></style>
