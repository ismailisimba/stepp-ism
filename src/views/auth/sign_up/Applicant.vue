<template>
  <div class="pb-3">
    <v-alert
      v-model="showAlert"
      color="error"
      variant="tonal"
      closable
      :text="errorMessage"
    ></v-alert>
  </div>
  <v-form ref="applicantForm" :disable="disableForm">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :label="$t('firstName')"
          type="text"
          aria-autocomplete="none"
          v-model="state.first_name"
          @blur="v$.first_name.$touch"
          @input="v$.first_name.$touch"
          :error-messages="v$.first_name.$errors.map((e : any) => e.$message)"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :label="$t('lastName')"
          type="text"
          aria-autocomplete="none"
          v-model="state.last_name"
          @blur="v$.last_name.$touch"
          @input="v$.last_name.$touch"
          :error-messages="v$.last_name.$errors.map((e : any) => e.$message)"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-text-field
      :label="$t('email')"
      type="email"
      aria-autocomplete="none"
      v-model="state.email"
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
      :error-messages="v$.email.$errors.map((e : any) => e.$message)"
      required
    ></v-text-field>

    <v-text-field
      type="password"
      :label="$t('password')"
      aria-autocomplete="none"
      v-model="state.password"
      @blur="v$.password.$touch"
      @input="v$.password.$touch"
      :error-messages="v$.password.$errors.map((e : any) => e.$message)"
      required
    ></v-text-field>

    <v-text-field
      type="password"
      :label="$t('confirmPassword')"
      aria-autocomplete="none"
      v-model="state.confirm_password"
      @blur="v$.confirm_password.$touch"
      @input="v$.confirm_password.$touch"
      :error-messages="v$.confirm_password.$errors.map((e : any) => e.$message)"
      required
    ></v-text-field>

    <v-checkbox
      :label="$t('agreeWithTerms&Conditions')"
      type="checkbox"
      v-model="state.terms"
      @blur="v$.terms.$touch"
      @change="v$.terms.$touch"
      :error-messages="v$.terms.$errors.map((e : any) => e.$message)"
    ></v-checkbox>

    <div class="text-center pa-0">
      <v-btn
        color="primary"
        :loading="isSubmitting"
        @click.prevent="submit"
        class="text-none"
        >{{ $t("signUp") }}</v-btn
      >
    </div>
  </v-form>

  <v-row class="my-5 d-flex align-center">
    <v-col cols="5">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="2 text-center"> {{ t("or") }} </v-col>
    <v-col cols="5">
      <v-divider></v-divider>
    </v-col>
  </v-row>

  <a href="#" @click.prevent="googleSignup('applicant')" class="pa-0 ma-0">
    <!-- mt-auto d-flex justify-center -->
    <v-row no-gutters class="mt-auto d-flex align-center justify-center">
      <v-col cols="1" class="pa-0 ma-0">
        <v-img height="20" src="/imgs/logos/google.svg"></v-img>
      </v-col>
      <v-col cols="4" class="pt-0 pl-0">
        {{ t("signUpWithGoogle") }}
      </v-col>
    </v-row>
  </a>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  maxLength,
  minLength,
  sameAs,
} from "@vuelidate/validators";
import { KeyValPair } from "@/types/KeyValPair";
import { signUpApplicant, googleSignup } from "@/services/auth_service";
import { useI18n } from "vue-i18n";
import router from "@/router";
import {
  containsLowerChar,
  containsNumber,
  containsSpecialChar,
  containsUpperChar,
  passwordMatch,
} from "@/helpers/validators";

const { t } = useI18n();

const formState: ApplicantFormFields = {
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
  password: null,
  confirm_password: null,
  terms: null,
};

const state = reactive({
  ...formState,
});

const rules = computed(() => ({
  first_name: { required, maxlength: maxLength(191) },
  last_name: { required, maxlength: maxLength(191) },
  email: { required, email, maxlength: maxLength(191) },
  password: {
    required,
    minLength: minLength(8),
    containsNumber: containsNumber(t),
    containsSpecialChar: containsSpecialChar(t),
    containsLowerChar: containsLowerChar(t),
    containsUpperChar: containsUpperChar(t),
    maxlength: maxLength(191),
  },
  confirm_password: {
    required,
    maxlength: maxLength(191),
    passwordMatch: passwordMatch(state.password as string, t),
  },
  terms: { required, sameAsRawValue: sameAs(true) },
}));

const v$ = useVuelidate(rules, state);

const isSubmitting = ref(false);

const showAlert = ref(false);

const errorMessage = ref("");

const alertColor = ref("error");

const disableForm = computed(() => {
  if (isSubmitting.value) return true;
  return false;
});

const data = () => {
  let payload = new FormData();
  let inputs: object = {
    given_name: state.first_name,
    family_name: state.last_name,
    "applicant-email": state.email,
    "applicant-password": state.password,
  };
  payload.append("inputs", JSON.stringify(inputs));
  return payload;
};

const reset = () => {
  v$.value.$reset();
  for (const [key, value] of Object.entries(formState)) {
    (state as any)[key] = value;
  }
};

const submit = async () => {
  //Hide & reset alert
  showAlert.value = false;
  errorMessage.value = "";

  //Validate
  v$.value.$touch();
  if (v$.value.$invalid) return;
  //End validate

  isSubmitting.value = true;
  let res: KeyValPair = {};

  try {
    await signUpApplicant(data()).then((r) => {
      isSubmitting.value = false;
      let user = r.user;
      switch (user) {
        case "exists!":
          errorMessage.value = t("emailExistsErrorMessage");
          alertColor.value = "error";
          showAlert.value = true;
          reset();
          break;

        case "new user  validated succesfully":
          router.push({ name: "sign_in", query: { success: "signUp" } });
          break;

        default:
          errorMessage.value = t("generalErrorMessage");
          alertColor.value = "error";
          showAlert.value = true;
          reset();
          break;
      }
    });
  } catch (error: any) {
    isSubmitting.value = false;
    alertColor.value = "error";
    errorMessage.value = t("generalErrorMessage");
    showAlert.value = true;
    throw error;
  }
};
</script>
