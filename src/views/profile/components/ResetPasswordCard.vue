<template>
  <v-card
    class="mx-auto my-12 pa-5"
    max-width="450"
  >
    <v-card-title class="text-subtitle-3 text-pageHeading">{{
      $t("changePassword")
    }}</v-card-title>

    <v-card-text>
      <reset-password-form />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import ResetPasswordForm from "./ResetPasswordForm.vue";
</script>

<style scoped></style>
