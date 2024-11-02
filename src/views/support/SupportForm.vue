<template>
  <v-form :disabled="disableForm">
    <v-row>
      <v-col cols="12">
        <v-textarea
          :label="$t('describeIssueOrQuestion')"
          v-model="state.message"
          @blur="v$.message.$touch"
          @input="v$.message.$touch"
          :error-messages="v$.message.$errors.map((e : any) => e.$message)"
          bg-color="white"
          color="primary"
          maxlength="1000"
        ></v-textarea>
      </v-col>
    </v-row>
    <div class="text-center pa-0" v-if="showSubmitBtn">
      <v-btn
        :loading="isSubmitting"
        @click.prevent="submit"
        color="primary"
        class="text-none"
        >{{ $t("submit") }}</v-btn
      >
    </div>
  </v-form>

  <Snackbar
    :color="snackBarColor"
    :message="snackBarMessage"
    :show="snackBarShow"
  />
</template>

<script setup lang="ts">
import {ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { KeyValPair } from "@/types/KeyValPair";
import Snackbar from "@/views/components/snackbars/Default.vue";
import { SnackbarColor } from "@/types/types";
import { sendSupportQuery } from "@/services/support_service";
import { useI18n } from "vue-i18n";
import { CustomException } from "@/helpers/errorHelper";

const { t } = useI18n();

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

const hideSnackBar = async () => {
  snackBarShow.value = false;
  snackBarMessage.value = "";
  snackBarColor.value = "success";
};

const showSnackBar = (color: SnackbarColor, message: string) => {
  snackBarColor.value = color;
  snackBarMessage.value = message;
  snackBarShow.value = true;
};

const formState: SupportFormFields = {
  message: "",
};

const snackBar = ref(false);

const state = reactive({
  ...formState,
});

const rules = {
  message: { required, maxlength: maxLength(1000) },
};

const v$ = useVuelidate(rules, state);

const isSubmitting = ref(false);

const disableForm = computed(() => {
  if (isSubmitting.value) return true;
  return false;
});

const reset = () => {
  v$.value.$reset();
  for (const [key, value] of Object.entries(formState)) {
    (state as any)[key] = value;
  }
};

const payload = () => {
  let payload = new FormData();
  let inputs: object = [state.message];
  payload.append("input", JSON.stringify(inputs));
  return payload;
};

const submit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    throw CustomException(t("formValidationError"), "validation");
  }
  isSubmitting.value = true;
  let res: KeyValPair = {};
  try {
    res = await sendSupportQuery(payload()).then((res: any) => {
      isSubmitting.value = false;
      let success = res.success || false;
      if (success) {
        reset();
        if (props.snackIt) snackBar.value = true;
      }
      return res;
    });
  } catch (error: any) {
    isSubmitting.value = false;
    throw error;
  }
  return res;
};

defineExpose<{ submit: () => Promise<any> }>({
  submit,
});

const props = withDefaults(
  defineProps<{
    showSubmitBtn?: boolean;
    snackIt?: boolean;
  }>(),
  {
    showSubmitBtn: true,
    snackIt: true,
  }
);
</script>
