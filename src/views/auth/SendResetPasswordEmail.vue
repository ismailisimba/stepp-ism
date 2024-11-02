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

          <v-card-subtitle class="pb-2 pt-5">
            {{ $t("resetPasswordTitle") }}
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
                :label="$t('email')"
                bg-color="white"
                color="primary"
                type="email"
                aria-autocomplete="none"
                v-model="state.email"
                :error-messages="v$.email.$errors.map((e : any) => e.$message)"
                @blur="v$.email.$touch"
                @input="v$.email.$touch"
                required
              ></v-text-field>
              <div class="text-center">
                <v-btn
                  color="primary"
                  :loading="loading"
                  class="mt-4 text-none"
                  @click="submit"
                  >{{ $t("sendRequest") }}</v-btn
                >
              </div>
            </v-form>
          </v-card-text>

          <v-spacer></v-spacer>

          <div class="text-center pt-3">
            <router-link :to="{ name: 'sign_in' }">
              {{ $t("alreadyHaveAnAccount") }}
            </router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import router from "@/router";
import { sendPasswordResetEmail } from "@/services/auth_service";
import useVuelidate from "@vuelidate/core";
import { required, email, maxLength } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const formState = {
  email: "",
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
  email: {
    required,
    email,
    maxlength: maxLength(191),
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

  try {
    await sendPasswordResetEmail(payload()).then((success) => {
      if (success) {
        router.push({
          name: "sign_in",
          query: { success: "resetPasswordEmail" },
        });
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

const payload = () => {
  let payload = new FormData();
  let inputs: object = {
    "applicant-email": state.email,
  };
  payload.append("inputs", JSON.stringify(inputs));
  return payload;
};
</script>
