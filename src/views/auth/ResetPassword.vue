<template>
  <v-container class="fill-height" fluid>
    <v-row class="d-flex align-center justify-center">
      <v-col cols="12" class="d-flex justify-center align-center">
        <v-card variant="text" min-width="500" max-width="600">
          <v-card-title>
            <v-img
              aspect-ratio="1"
              height="120"
              src="/imgs/logos/stepp.png"
            ></v-img>
          </v-card-title>

          <v-card-subtitle class="pb-3">
            {{ t("resetPasswordMsg") }}
          </v-card-subtitle>

          <v-card-text>
            <div class="pb-3" v-if="showAlert">
              <v-alert
                v-model="showAlert"
                :color="alertColor"
                variant="tonal"
                closable
                :text="errorMessage"
              ></v-alert>
            </div>

            <v-form :disabled="disableForm">
              <!-- Inputs -->
              <v-text-field
                v-model="state.newPassword"
                :append-inner-icon="
                  newPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                "
                :label="t('password')"
                :type="newPasswordVisible ? 'text' : 'password'"
                :error-messages="v$.newPassword.$errors.map((e : any) => e.$message)"
                @click:append-inner="newPasswordVisible = !newPasswordVisible"
                @blur="v$.newPassword.$touch"
                @input="v$.newPassword.$touch"
                required
              ></v-text-field>

              <v-text-field
                v-model="state.confirmPassword"
                :append-inner-icon="
                  confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                "
                :label="t('confirmPassword')"
                :type="confirmPasswordVisible ? 'text' : 'password'"
                :error-messages="v$.confirmPassword.$errors.map((e : any) => e.$message)"
                @click:append-inner="
                  confirmPasswordVisible = !confirmPasswordVisible
                "
                @blur="v$.confirmPassword.$touch"
                @input="v$.confirmPassword.$touch"
                required
              ></v-text-field>

              <!-- Buttons -->
              <v-row no-gutters class="pt-5">
                <v-col cols="12">
                  <v-btn
                    :loading="loading"
                    @click.prevent="submit"
                    block
                    color="primary"
                    class="mt-4 text-none"
                    >{{ t("resetPassword") }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { KeyValPair } from "@/types/KeyValPair";
import useVuelidate from "@vuelidate/core";
import { maxLength, minLength, required } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import { resetPassword } from "@/services/auth_service";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "@/router";
import { objectToFormData } from "@/helpers/general";
import {
  containsLowerChar,
  containsNumber,
  containsSpecialChar,
  containsUpperChar,
  passwordMatch,
} from "@/helpers/validators";
const route = useRoute();

const { t } = useI18n();

const newPasswordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const formState = {
  newPassword: "",
  confirmPassword: "",
  secret: route.params.secret as string,
};

const state = reactive({
  ...formState,
});

const loading = ref(false);
const showAlert = ref(false);
const errorMessage = ref("");
const alertColor = ref("error");
errorMessage.value = t("signUp");

const rules = computed(() => ({
  newPassword: {
    required,
    minLength: minLength(8),
    containsNumber: containsNumber(t),
    containsSpecialChar: containsSpecialChar(t),
    containsLowerChar: containsLowerChar(t),
    containsUpperChar: containsUpperChar(t),
    maxlength: maxLength(191),
  },
  confirmPassword: {
    required,
    maxlength: maxLength(191),
    passwordMatch: passwordMatch(state.newPassword, t),
  },
}));

const v$ = useVuelidate(rules, state);

const disableForm = computed(() => {
  if (loading.value) return true;
  return false;
});

const submit = async () => {
  //Hide & reset alert
  showAlert.value = false;
  errorMessage.value = "";

  //Validate
  v$.value.$touch();
  if (v$.value.$invalid) return;

  loading.value = true;
  let resp: KeyValPair = {};

  try {
    await resetPassword(
      objectToFormData(state),
      route.params.id as string,
      state.secret as string
    ).then((success) => {
      if (success) {
        router.push({ name: "sign_in", query: { success: "resetPassword" } });
        return;
      }
      alertColor.value = "error";
      errorMessage.value = t("generalErrorMessage");
      showAlert.value = true;
      loading.value = false;
    });
  } catch (error: any) {
    alertColor.value = "error";
    errorMessage.value = t("generalErrorMessage");
    showAlert.value = true;
    loading.value = false;
    throw error;
  }
};
</script>
