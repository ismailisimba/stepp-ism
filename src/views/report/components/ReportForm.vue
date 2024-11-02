<template>
  <v-form>
    <v-row>
      <v-col cols="12">
        <v-textarea
          :label="$t('description')"
          v-model="state.description"
          @blur="v$.description.$touch"
          @input="v$.description.$touch"
          :error-messages="v$.description.$errors.map((e : any) => e.$message)"
          bg-color="white"
          color="primary"
          maxlength="1000"
          counter
        ></v-textarea>
      </v-col>

      <v-col cols="12">
        <v-file-input
          :label="$t('documents')"
          v-model="state.documents"
          :error-messages="v$.documents.$errors.map((e : any) => e.$message)"
          bg-color="white"
          color="primary"
          @blur="v$.documents.$touch"
          @input="v$.documents.$touch"
          multiple
          counter
          chips
          show-size
        >
        </v-file-input>
      </v-col>
    </v-row>
  </v-form>

  <Snackbar
    :show="snackBar"
    color="success"
    :message="$t(isUpdating ? 'programUpdatedMessage' : 'programCreated')"
  />
</template>

<script setup lang="ts">
import {ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import Snackbar from "@/views/components/snackbars/Default.vue";
import { useI18n } from "vue-i18n";
import { CustomException } from "@/helpers/errorHelper";

const props = withDefaults(
  defineProps<{
    showSubmitBtn?: boolean;
    description?: string;
    snackIt?: boolean;
  }>(),
  {
    showSubmitBtn: true,
    snackIt: true,
  }
);

const isUpdating = ref(false);
const { t } = useI18n();

const formState: ReportFormFields = {
  description: props.description || '',
  documents: null,
};

const snackBar = ref(false);

const state = reactive({
  ...formState,
});

const rules = computed(() => ({
  description: { required, maxlength: maxLength(1000) },
  documents: {},
}));

const v$ = useVuelidate(rules, state);

const reset = () => {
  v$.value.$reset();
  for (const [key, value] of Object.entries(formState)) {
    (state as any)[key] = value;
  }
};

const getReport = (): ReportFormFields => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    throw CustomException(t("formValidationError"), "validation");
  }
  const p: ReportFormFields = {
    ...(state as ReportFormFields),
  };
  return p;
};

defineExpose<{
  getReport: () => ReportFormFields;
}>({
  getReport,
});
</script>
