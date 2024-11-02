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
            {{ t("loginTitle") }}
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
                v-model="state.email"
                :label="$t('email')"
                type="email"
                :error-messages="v$.email.$errors.map((e : any) => e.$message)"
                @blur="v$.email.$touch"
                @input="v$.email.$touch"
                required
              ></v-text-field>

              <v-text-field
                v-model="state.password"
                :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :label="t('password')"
                :type="passwordVisible ? 'text' : 'password'"
                :error-messages="v$.password.$errors.map((e : any) => e.$message)"
                @click:append-inner="passwordVisible = !passwordVisible"
                @blur="v$.password.$touch"
                @input="v$.password.$touch"
                required
              ></v-text-field>

              <v-row no-gutters class="pt-4">
                <v-col cols="5" class="">
                  <a
                    href=""
                    @click.prevent="loginWithContinue"
                    class="pa-0 ma-0"
                  >
                    <v-row no-gutters>
                      <v-col cols="2 pa-0 ma-0">
                        <v-img height="20" src="/imgs/logos/google.svg"></v-img>
                      </v-col>
                      <v-col cols="10 pt-0 pl-0" class="">
                        {{ t("continueWithGoogle") }}
                      </v-col>
                    </v-row>
                  </a>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="text-right">
                  <router-link
                    :to="{ name: 'reset_password_form' }"
                    name="reset_password"
                  >
                    {{ t("forgotPassword") }}
                  </router-link>
                </v-col>
              </v-row>

              <!-- Buttons -->
              <v-row no-gutters class="pt-5">
                <v-col cols="3">
                  <v-btn
                    :loading="loading"
                    @click.prevent="submit"
                    block
                    color="primary"
                    class="mt-4 text-none"
                    >{{ t("login") }}</v-btn
                  >
                </v-col>
                <v-col cols="1"> </v-col>
                <v-col cols="3">
                  <v-btn
                    :to="{ name: 'sign_up' }"
                    block
                    :disabled="disableForm"
                    variant="outlined"
                    class="mt-4 text-none"
                    >{{ t("signUp") }}</v-btn
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
import { email, required } from "@vuelidate/validators";
import { computed, onMounted, reactive, ref } from "vue";
import { initiateGoogleAuth, login } from "@/services/auth_service";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute();
const onSuccessAction = route.query.success as string | undefined;

const { t } = useI18n();

const passwordVisible = ref(false);

const formState = {
  email: "",
  password: "",
};

const state = reactive({
  ...formState,
});

const loading = ref(false);

const showAlert = ref(false);

const errorMessage = ref("");

const alertColor = ref("error");

errorMessage.value = t("signUp");

const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, state);

const disableForm = computed(() => {
  if (loading.value) return true;
  return false;
});


const payload = () => {
  let payload = new FormData();
  let inputs: object = {
    "login-email": state.email,
    "login-password": state.password,
  };
  payload.append("inputs", JSON.stringify(inputs));
  return payload;
};

const loginWithContinue = async () => {
  await initiateGoogleAuth();
};

const showSignUpSuccessMsg = () => {
  if (onSuccessAction) {
    alertColor.value = "success";
    switch (onSuccessAction) {
      case "signUp":
        errorMessage.value = t("signUpSuccessMessage");
        break;
      case "resetPassword":
        errorMessage.value = t("resetPasswordSuccessMsg");
        break;
      case "resetPasswordEmail":
        errorMessage.value = t("resetPasswordSuccessEmailMsg");
        break;
      default:
        errorMessage.value = t("loginTitle");
        break;
    }
    showAlert.value = true;
  }
};

onMounted(async () => {
  showSignUpSuccessMsg();
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
    await login(payload()).then((success) => {
      if (success) {
        router.push({ name: "home" });
        return;
      }
      alertColor.value = "error";
      errorMessage.value = t("invalidCredentials");
      showAlert.value = true;
      loading.value = false;

      // switch (success) {
      //   case "logged-in!":
      //     router.push({ name: "programs" });
      //     break;

      //   default:
      //     alertColor.value = "error";
      //     errorMessage.value = t("invalidCredentials");
      //     showAlert.value = true;
      //     break;
      // }
      // loading.value = false;
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

<style scoped>
.fill-height {
  height: 100vh;
}

.photo-section .v-img {
  object-fit: cover;
  /* Ensure the image covers the container */
}
</style>
