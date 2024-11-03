<template>
  <v-alert
    v-model="alertShow"
    :color="alertColor"
    variant="tonal"
    closable
    :text="alertMessage"
  ></v-alert>

  <v-form ref="applicantForm" :disabled="disableForm">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :label="$t('firstName')"
          type="text"
          aria-autocomplete="none"
          v-model="state.first_name"
          @blur="v$.first_name.$touch"
          @input="v$.first_name.$touch"
          :error-messages="v$.first_name.$errors.map((e) => e.$message)"
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
          :error-messages="v$.last_name.$errors.map((e) => e.$message)"
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
      :error-messages="v$.email.$errors.map((e) => e.$message)"
      required
    ></v-text-field>

    <v-col cols="12">
      <v-file-input
        :label="$t('profilePhoto')"
        prepend-icon="mdi-account-outline"
        v-model="state.photo"
        :error-messages="v$.photo.$errors.map((e) => e.$message)"
        @blur="v$.photo.$touch"
        @input="v$.photo.$touch"
        show-size
      >
      </v-file-input>
    </v-col>

    <div class="py-5">
      <v-btn
        color="primary"
        rounded="pill"
        class="text-none"
        :loading="isSubmitting"
        @click.prevent="submit"
        block
        >{{ $t("save") }}</v-btn
      >
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, maxLength } from "@vuelidate/validators";
import { updateProfile } from "@/services/auth_service";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const authStore = useAuthStore();
const { authUser } = storeToRefs(authStore);

const formState: ProfileFormFields = {
  first_name: authUser.value?.firstName || "",
  last_name: authUser.value?.lastName || "",
  email: authUser.value?.email || "",
  photo: null,
};

const state = reactive({
  ...formState,
});

const rules = {
  first_name: { required, maxlength: maxLength(191) },
  last_name: { required, maxlength: maxLength(191) },
  email: { required, email, maxlength: maxLength(191) },
  photo: {},
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
  payload.append("firstName", "" + state.first_name);
  payload.append("lastName", "" + state.last_name);
  payload.append("email", "" + state.email);
  payload.append("userType", "" + authUser.value?.accountType);
  payload.append("profilePicture", state.photo);
  return payload;
};

const submit = async () => {
  //Hide & reset alert
  hideAlert();

  //Validate
  v$.value.$touch();
  if (v$.value.$invalid) return;
  //End validate

  isSubmitting.value = true;
  try {
    await updateProfile(payload()).then((r) => {
      console.log(r,"rttt")
      const url = "https://grantman-czivjdfhnq-ez.a.run.app/public_files/"+encodeURIComponent(r.id.profPic)
      isSubmitting.value = false;
      showAlert("success", t("profileUpdate"));
      authStore.updateAuthUser(
        r.firstName || "",
        r.lastName || "",
        state.email || "",
        url || ""
      );
    });
  } catch (error: any) {
    isSubmitting.value = false;
    showAlert("error", t("generalErrorMessage"));
    throw error;
  }
};
</script>
