<template>
  <v-form :disabled="disableForm">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.name"
          :label="$t('name')"
          :error-messages="v$.name.$errors.map((e : any) => e.$message)"
          bg-color="white"
          color="primary"
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
        <v-textarea
          :label="$t('associatedResults')"
          v-model="state.associatedResults"
          @blur="v$.associatedResults.$touch"
          @input="v$.associatedResults.$touch"
          :error-messages="v$.associatedResults.$errors.map((e : any) => e.$message)"
          bg-color="white"
          color="primary"
          maxlength="1000"
          counter
        ></v-textarea>
      </v-col>

      <v-col cols="12">
        <v-textarea
          :label="$t('associatedOutcomes')"
          v-model="state.associatedOutcomes"
          @blur="v$.associatedOutcomes.$touch"
          @input="v$.associatedOutcomes.$touch"
          :error-messages="v$.associatedOutcomes.$errors.map((e : any) => e.$message)"
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
import { required, maxLength } from "@vuelidate/validators";
import { KeyValPair } from "@/types/KeyValPair";
import Snackbar from "@/views/components/snackbars/Default.vue";
import DatePicker from "@/views/components/inputs/DatePicker.vue";
import { Activity } from "@/models/Activity";
import { CustomException } from "@/helpers/errorHelper";
import { useI18n } from "vue-i18n";
import { dateBetween } from "@/helpers/validators";

const props = withDefaults(
  defineProps<{
    activity?: Activity | null;
    showSubmitBtn?: boolean;
    snackIt?: boolean;
    minDate: Date;
    maxDate: Date;
  }>(),
  {
    showSubmitBtn: true,
    snackIt: true,
  }
);

const { t } = useI18n();
const isUpdating = ref(false);
const formState: ActivityFormFields = {
  name: "",
  startDate: null,
  endDate: null,
  description: "",
  associatedResults: "",
  associatedOutcomes: "",
};

const snackBar = ref(false);
const state = reactive({
  ...formState,
});

const rules = computed(() => ({
  name: { required, maxlength: maxLength(191) },
  startDate: {
    required,
    dateBetween: dateBetween(props.minDate, props.maxDate, t),
  },
  endDate: {
    required,
    dateBetween: dateBetween(state.startDate as Date, props.maxDate, t),
  },
  description: { required, maxlength: maxLength(1000) },
  associatedResults: { required, maxlength: maxLength(1000) },
  associatedOutcomes: { required, maxlength: maxLength(1000) },
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

const getActivity = (): Activity => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    throw CustomException(t("formValidationError"), "validation");
  }
  const act: Activity = {
    ...(state as Activity),
  };
  return act;
};

const submit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  isSubmitting.value = true;
  let res: KeyValPair = {};
  try {
    // res = await store(isUpdating.value, state).then((res) => {
    //   isSubmitting.value = false;
    //   let success = res.success || false;
    //   if (success) {
    //     reset();
    //     if (props.snackIt) snackBar.value = true;
    //   }
    //   return res;
    // });
  } catch (error: any) {
    isSubmitting.value = false;
    throw error;
  }
  return res;
};

const populate = async () => {
  if (props.activity) {
    reset();
    let a = props.activity;
    state.name = a.name;
    state.startDate = a.startDate;
    state.endDate = a.endDate;
    state.associatedResults = a.associatedResults;
    state.associatedOutcomes = a.associatedResults;
    state.description = a.description;
    isUpdating.value = true;
  }
};

onMounted(async () => {
  await populate();
});

defineExpose<{
  submit: () => Promise<any>;
  getActivity: () => Activity;
}>({
  submit,
  getActivity,
});
</script>
