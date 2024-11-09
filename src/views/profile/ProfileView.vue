<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <profile-card />
      </v-col>
      <v-col cols="12" md="6">
        <reset-password-card />
      </v-col>
    </v-row>
    <!-- Conditionally display UpgradeAdminAccessCard or UserPermissions -->
    <v-row>
      <v-col cols="12" md="12">
        <upgrade-admin-access-card v-if="!isSuperAdmin && isDonor" />
        <user-permissions v-else-if="isSuperAdmin" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import ProfileCard from "./components/ProfileCard.vue";
import ResetPasswordCard from "./components/ResetPasswordCard.vue";
import UpgradeAdminAccessCard from "./components/UpgradeAdminAccessCard.vue";
import UserPermissions from "./components/UserPermissions.vue";

const authStore = useAuthStore();

const isSuperAdmin = computed(() => {
  return authStore.authUser?.superAdminType === 'superadmin';
});

const isDonor = computed(() => {
  return authStore.authUser?.accountType === 'donor';
});
</script>
