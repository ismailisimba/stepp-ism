<template>
    <!-- Display Error and Success Messages -->
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      closable
      class="mb-4"
      :text="errorMessage"
    ></v-alert>
    <v-alert
      v-if="successMessage"
      type="success"
      variant="tonal"
      closable
      class="mb-4"
      :text="successMessage"
    ></v-alert>
  
    <v-form :disabled="disableForm">
      <v-card class="pa-4">
        <v-card-title class="text-h6">
          {{ $t('upgradeAdminAccess') }}
        </v-card-title>
        <v-card-text>
          <!-- Display current superAdminType status -->
          <v-alert
            v-if="superAdminStatus"
            type="success"
            variant="tonal"
            class="mb-4"
            :text="$t('superAdminAccessGranted')"
          ></v-alert>
          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mb-4"
            :text="$t('superAdminAccessNotGranted')"
          ></v-alert>
  
          <!-- Input for upgrade code -->
          <v-text-field
            v-model="code"
            :label="$t('enterUpgradeCode')"
            :error-messages="v$.code.$errors.map(e => e.$message)"
            @blur="v$.code.$touch"
            @input="v$.code.$touch"
            :disabled="isSubmitting || superAdminStatus"
            :hint="superAdminStatus ? $t('alreadySuperAdmin') : ''"
            persistent-hint
            required
          ></v-text-field>
        </v-card-text>
  
        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            rounded="pill"
            class="text-none"
            :loading="isSubmitting"
            @click.prevent="submit"
            :disabled="isSubmitting || superAdminStatus"
          >
            {{ $t("save") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/store/authStore';
  import { storeToRefs } from 'pinia';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import useVuelidate from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  
  const { t } = useI18n();
  const authStore = useAuthStore();
  const { authUser } = storeToRefs(authStore);
  
  const code = ref('');
  const isSubmitting = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  
  const superAdminStatus = computed(() => {
    return authUser.value?.superAdminType === 'superadmin';
  });
  
  const rules = {
    code: { required },
  };
  
  const v$ = useVuelidate(rules, { code });
  
  const disableForm = computed(() => {
    return isSubmitting.value || superAdminStatus.value;
  });
  
  const submit = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
  
    isSubmitting.value = true;
    errorMessage.value = '';
    successMessage.value = '';
  
    try {
      const response = await axios.get(
        `https://grantman-czivjdfhnq-ez.a.run.app/upgradeadminaccesscode/${encodeURIComponent(code.value)}`
      );
      // Assuming the response contains the updated user data
      const updatedUser = response.data;
  
      // Update the authUser in the store
      authStore.setUser(updatedUser);
  
      // Display success message
      successMessage.value = t('upgradeSuccess');
    } catch (error: any) {
      // Handle error, display error message
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage.value = error.response.data.message;
      } else if (error.message) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = t('generalErrorMessage');
      }
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  .v-card {
    margin-top: 20px;
    margin-bottom: 32px;
  }
  </style>
  