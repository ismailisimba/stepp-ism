<template>
  <v-card class="mx-auto my-12 pa-5" max-width="450">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="primary"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-card-title class="text-subtitle-3 text-pageHeading">{{
      $t("updateProfile")
    }}</v-card-title>

    <div class="d-flex align-center justify-space-around">
      <v-avatar
        size="250"
        :image="authStore.authUser?.displayPhoto || '/imgs/profile.jpg'"
        cover
      ></v-avatar>
    </div>

    <v-card-text>
      <profile-form />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import ProfileForm from "./ProfileForm.vue";
const authStore = useAuthStore();
</script>

<style scoped></style>
