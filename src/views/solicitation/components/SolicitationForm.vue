<template>
  <v-form :disabled="disableForm">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.name"
          :label="$t('solicitationName')"
          :error-messages="v$.name.$errors.map((e : any) => e.$message)"
          aria-autocomplete="none"
          @blur="v$.name.$touch"
          @input="v$.name.$touch"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-autocomplete
          on
          :loading="isLoadingPrograms"
          v-model="state.program_id"
          @blur="v$.program_id.$touch"
          @input="v$.program_id.$touch"
          :error-messages="v$.program_id.$errors.map((e : any) => e.$message)"
          :items="programs"
          item-title="name"
          item-value="id"
          :label="$t('program')"
        >
        </v-autocomplete>
      </v-col>

      <v-col cols="12" sm="12" md="6">
        <DatePicker
          v-model="state.start_date"
          @blur="v$.start_date.$touch"
          @input="v$.start_date.$touch"
          :label="$t('startDate')"
          :error-messages="v$.start_date.$errors.map((e : any) => e.$message)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <DatePicker
          v-model="state.end_date"
          :label="$t('endDate')"
          @blur="v$.end_date.$touch"
          @input="v$.end_date.$touch"
          :error-messages="v$.end_date.$errors.map((e : any) => e.$message)"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          :label="$t('fundingPerProjectUSD')"
          v-model="state.funding_per_project_usd"
          @blur="v$.funding_per_project_usd.$touch"
          @input="v$.funding_per_project_usd.$touch"
          :error-messages="v$.funding_per_project_usd.$errors.map((e : any) => e.$message)"
          prefix="$"
          type="number"
          aria-autocomplete="none"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-textarea
          :label="$t('description')"
          v-model="state.description"
          @blur="v$.description.$touch"
          @input="v$.description.$touch"
          :error-messages="v$.description.$errors.map((e : any) => e.$message)"
          maxlength="1000"
          counter
        ></v-textarea>
      </v-col>

      <v-col cols="12">
        <v-autocomplete
          on
          :loading="isLoadingCountries"
          v-model="state.locations"
          @blur="v$.locations.$touch"
          @input="v$.locations.$touch"
          :error-messages="v$.locations.$errors.map((e : any) => e.$message)"
          :items="countries"
          item-title="name"
          item-value="name"
          :label="$t('locations')"
          chips
          closable-chips
          multiple
          :clear-on-select="true"
        >
        </v-autocomplete>
      </v-col>

      <v-col cols="12">
        <v-file-input
          :label="$t('documents')"
          v-model="state.fileInput"
          :error-messages="v$.fileInput.$errors.map((e : any) => e.$message)"
          @blur="v$.fileInput.$touch"
          @input="v$.fileInput.$touch"
          multiple
          counter
          chips
          show-size
        >
        </v-file-input>
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
import { store } from "@/services/solicitation_service";
import useVuelidate from "@vuelidate/core";
import { required, maxLength, requiredIf } from "@vuelidate/validators";
import { KeyValPair } from "@/types/KeyValPair";
import { Program, Programs } from "@/models/Program";
import DatePicker from "@/views/components/inputs/DatePicker.vue";
import { useCountryStore } from "@/store/countryStore";
import { storeToRefs } from "pinia";
import { defineAsyncComponent } from "vue";
import { get as getPrograms } from "@/services/program_service";
import { useI18n } from "vue-i18n";
import { Solicitation } from "@/models/Solicitation";
import { objectToFormData } from "@/helpers/general";

const { t } = useI18n();
const countryStore = useCountryStore();

countryStore.loadCountries();

const { isLoading: isLoadingCountries, countries } = storeToRefs(countryStore);

//Lazy load components
const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);

const props = withDefaults(
  defineProps<{
    program?: Program;
    showSubmitBtn?: boolean;
    snackIt?: boolean;
    solicitation?: Solicitation;
  }>(),
  {
    showSubmitBtn: true,
    snackIt: true,
  }
);

const isUpdating = ref(false);
const isRequiredFields = ref(true);

const isLoadingPrograms = ref<boolean>(false);
const programs = ref<Programs>();

const loadPrograms = async () => {
  try {
    isLoadingPrograms.value = true;
    await getPrograms(1, 1000, "name", "ASC").then((data) => {
      programs.value = data.items;
      isLoadingPrograms.value = false;
    });
  } catch (error) {
    isLoadingPrograms.value = false;
    throw error;
  }
};

const formState: SolicitationFormFields = {
  id: `solicitation/${Math.random()}`,
  program_id: null,
  name: "",
  status: "draft",
  start_date: null,
  end_date: null,
  funding_per_project_usd: null,
  description: "",
  locations: null,
  solicitation_questions: null,
  fileInput: null,
};

const snackBar = ref(false);

const state = reactive({
  ...formState,
});

const checkIfDocIsRequired = () => {
  return true;
  //return props.solicitation ? false : true;
};

const rules = {
  name: { required, maxlength: maxLength(500) },
  program_id: { required },
  start_date: { required },
  end_date: { required },
  funding_per_project_usd: { required },
  description: { required, maxlength: maxLength(1000) },
  locations: { required },
  fileInput: { requiredIfFunction: requiredIf(checkIfDocIsRequired) },
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

const submit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    throw new Error(t("formValidationError"));
  }

  isSubmitting.value = true;
  let res: KeyValPair = {};
  try {
    res = await store(isUpdating.value, getPayload()).then((res) => {
      isSubmitting.value = false;
      return res;
    });
  } catch (error: any) {
    isSubmitting.value = false;
    throw new Error(t("createSolicicationError"));
  }
  return res;
};

const populate = async () => {
  if (props.solicitation) {
    let s = props.solicitation;
    state.id = s.id;
    state.name = s.name;
    state.program_id = s.programId;
    state.start_date = s.startDate;
    state.end_date = s.endDate;
    state.funding_per_project_usd = s.fundingPerProjectUSD;
    state.description = s.description;
    state.locations = s.locations;
    state.solicitation_questions = s.questions;
    state.status = 'draft';
    isUpdating.value = true;
    isRequiredFields.value = false;
  }
};

const getPayload = () => {
  let payload = objectToFormData(state);
  payload.append("name_type", "STRING");
  payload.append("start_date_type", "DATE");
  payload.append("end_date_type", "DATE");
  payload.append("description_type", "STRING");
  payload.append("status_type", "STRING");
  payload.append("locations_type", "STRING");
  payload.append("funding_per_project_usd_type", "INTEGER");
  payload.append("documents_type", "STRING");
  payload.append("solicitation_questions_type", "STRING");
  payload.append("program_type", "STRING");
  payload.append("program", "");
  payload.append("id_type", "STRING");
  payload.append("program_id_type", "STRING");
  return payload;
};

onMounted(async () => {
  await loadPrograms();
  await populate();
});

defineExpose({
  submit,
});
</script>
