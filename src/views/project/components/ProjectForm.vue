<template>
  <v-form :disabled="disableForm">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.name"
          :label="$t('projectName')"
          :error-messages="v$.name.$errors.map((e : any) => e.$message)"
          bg-color="white"
          color="primary"
          aria-autocomplete="none"
          @blur="v$.name.$touch"
          @input="v$.name.$touch"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="12" md="6">
        <DatePicker
          v-model="state.startDate"
          @blur="v$.startDate.$touch"
          @input="v$.startDate.$touch"
          :label="$t('startDate')"
          :error-messages="v$.startDate.$errors.map((e : any) => e.$message)"
        />
      </v-col>

      <v-col cols="12" sm="12" md="6">
        <DatePicker
          v-model="state.endDate"
          :label="$t('endDate')"
          @blur="v$.endDate.$touch"
          @input="v$.endDate.$touch"
          :error-messages="v$.endDate.$errors.map((e : any) => e.$message)"
        />
      </v-col>

      <v-col sm="12" md="6">
        <v-text-field
          :label="$t('budget')"
          v-model="state.budget"
          @blur="v$.budget.$touch"
          @input="v$.budget.$touch"
          :error-messages="v$.budget.$errors.map((e : any) => e.$message)"
          prefix="$"
          bg-color="white"
          color="primary"
          type="number"
          aria-autocomplete="none"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="12" md="6">
        <v-select
          v-model="state.reportingSchedule"
          :items="reportingSchedule.map((r) => t(r))"
          :label="$t('reportingSchedule')"
          @blur="v$.reportingSchedule.$touch"
          @input="v$.reportingSchedule.$touch"
          :error-messages="v$.reportingSchedule.$errors.map((e : any) => e.$message)"
          required
        ></v-select>
      </v-col>

      <!-- <v-col cols="12" sm="12" md="6">
        <v-select
          v-model="state.status"
          :items="projectStatus.map((s) => t(s))"
          :label="$t('status')"
          @blur="v$.status.$touch"
          @input="v$.status.$touch"
          :error-messages="v$.status.$errors.map((e : any) => e.$message)"
          required
        ></v-select>
      </v-col> -->

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
    :show="snackBar"
    color="success"
    :message="$t(isUpdating ? 'programUpdatedMessage' : 'programCreated')"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import { KeyValPair } from "@/types/KeyValPair";
import Snackbar from "@/views/components/snackbars/Default.vue";
import DatePicker from "@/views/components/inputs/DatePicker.vue";
import { Project } from "@/models/Project";
import { reportingSchedule } from "@/constants/app_constants";
import { useI18n } from "vue-i18n";
import { CustomException } from "@/helpers/errorHelper";
import { dateAfter } from "@/helpers/validators";

const props = withDefaults(
  defineProps<{
    project?: Project;
    showSubmitBtn?: boolean;
    snackIt?: boolean;
  }>(),
  {
    showSubmitBtn: true,
    snackIt: true,
  }
);

const isUpdating = ref(false);
const { t } = useI18n();
const formState: ProjectFormFields = {
  name: "",
  startDate: null,
  endDate: null,
  budget: null,
  description: "",
  reportingSchedule: null,
  status: 'created',
  activities: [],
};

const snackBar = ref(false);

const state = reactive({
  ...formState,
});

const rules = computed(() => ({
  name: { required, maxlength: maxLength(500) },
  startDate: { required },
  endDate: { required, dateAfter: dateAfter(state.startDate as Date, t) },
  budget: { required, numeric },
  reportingSchedule: { required },
  description: { required, maxlength: maxLength(1000) },
  status: { required },
}));

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

const getProject = (): ProjectFormFields => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    throw CustomException(t("formValidationError"), "validation");
  }
  const p: ProjectFormFields = {
    ...(state as ProjectFormFields),
  };
  return p;
};

const submit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  isSubmitting.value = true;
  let res: KeyValPair = {};
  try {
  } catch (error: any) {
    isSubmitting.value = false;
    throw error;
  }
  return res;
};

const populate = async () => {
  const project = props.project;
  state.name = project?.name || "";
  state.startDate = project?.startDate || null;
  state.endDate = project?.endDate || null;
  state.budget = project?.budgetUSD || null;
  state.description = project?.description || "";
  state.reportingSchedule = project?.reportSchedule || null;
  state.status = project?.status || null;
  state.activities = project?.activities || [];
};

onMounted(async () => {
  if (props.project) await populate();
});

defineExpose<{
  submit: () => Promise<any>;
  getProject: () => ProjectFormFields;
}>({
  submit,
  getProject,
});
</script>
