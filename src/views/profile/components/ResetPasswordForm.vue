<template>
  <v-alert
    v-model="alertShow"
    :color="alertColor"
    variant="tonal"
    closable
    :text="alertMessage"
  ></v-alert>
  <v-form :disabled="disableForm">
    <v-text-field
      :type="currentPasswordVisible ? 'text' : 'password'"
      :label="$t('currentPassword')"
      :append-inner-icon="currentPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="currentPasswordVisible = !currentPasswordVisible"
      aria-autocomplete="none"
      v-model="state.current_password"
      @blur="v$.current_password.$touch"
      @input="v$.current_password.$touch"
      :error-messages="v$.current_password.$errors.map((e) => e.$message)"
      required
    ></v-text-field>

    <v-text-field
      :type="newPasswordVisible ? 'text' : 'password'"
      :label="$t('password')"
      :append-inner-icon="newPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="newPasswordVisible = !newPasswordVisible"
      aria-autocomplete="none"
      v-model="state.new_password"
      @blur="v$.new_password.$touch"
      @input="v$.new_password.$touch"
      :error-messages="v$.new_password.$errors.map((e) => e.$message)"
      required
    ></v-text-field>

    <v-text-field
      :type="confirmPasswordVisible ? 'text' : 'password'"
      @click:append-inner="confirmPasswordVisible = !confirmPasswordVisible"
      :label="$t('confirmPassword')"
      :append-inner-icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      aria-autocomplete="none"
      v-model="state.confirm_password"
      @blur="v$.confirm_password.$touch"
      @input="v$.confirm_password.$touch"
      :error-messages="v$.confirm_password.$errors.map((e) => e.$message)"
      required
    ></v-text-field>

    <div class="py-5">
      <v-btn
        color="primary"
        class="text-none"
        rounded="pill"
        :loading="isSubmitting"
        @click.prevent="submit"
        :text="$t('change')"
        block
      />
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { changePassword } from "@/services/auth_service";
import { useI18n } from "vue-i18n";
import router from "@/router";

const { t } = useI18n();

const currentPasswordVisible = ref(false);
const newPasswordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const formState: PasswordResetFormFields = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const state = reactive({
  ...formState,
});

const rules = {
  current_password: { required, maxlength: maxLength(191) },
  new_password: { required, maxlength: maxLength(191) },
  confirm_password: { required, maxlength: maxLength(191) },
};

const v$ = useVuelidate(rules, state);
const isSubmitting = ref(false);
const alertShow = ref(false);
const alertColor = ref("error");
const alertMessage = ref("");
const disableForm = computed(() => {
  if (isSubmitting.value) return true;
  return false;
});

const hideAlert = async () => {
  alertShow.value = false;
  alertMessage.value = "";
  alertColor.value = "error";
  alertShow.value = false;
};

const showAlert = (color: string, message: string) => {
  alertColor.value = color;
  alertMessage.value = message;
  alertShow.value = true;
};

const payload = () => {
  let payload = new FormData();
  payload.append("currentPassword", "" + state.current_password);
  payload.append("newPassword", "" + state.new_password);
  payload.append("confirmPassword", "" + state.confirm_password);
  return payload;
};

const submit = async () => {
  //Hide & reset alert
  hideAlert();

  //Validate
  v$.value.$touch();
  if (v$.value.$invalid) return;
  //End validate

  try {
    isSubmitting.value = true;
    await changePassword(payload()).then(async (r) => {
      await router.push({ name: "sign_in", query: { message: "passwordReset" } });
      isSubmitting.value = false;
    });
  } catch (error: any) {
    isSubmitting.value = false;
    showAlert("error", t("generalErrorMessage"));
    throw error;
  }
};
</script>
