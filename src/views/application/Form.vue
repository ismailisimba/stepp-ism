<template>
  <v-form :disabled="disableForm">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.name"
          :label="$t('programName')"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
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
          v-model="state.start_date"
          @blur="v$.start_date.$touch"
          @input="v$.start_date.$touch"
          :label="$t('startDate')"
          :error-messages="v$.start_date.$errors.map((e) => e.$message)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <DatePicker
          v-model="state.end_date"
          :label="$t('endDate')"
          @blur="v$.end_date.$touch"
          @input="v$.end_date.$touch"
          :error-messages="v$.end_date.$errors.map((e) => e.$message)"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          :label="$t('fundingUSD')"
          v-model="state.funding"
          @blur="v$.funding.$touch"
          @input="v$.funding.$touch"
          :error-messages="v$.funding.$errors.map((e) => e.$message)"
          prefix="$"
          bg-color="white"
          color="primary"
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
          :error-messages="v$.description.$errors.map((e) => e.$message)"
          bg-color="white"
          color="primary"
          maxlength="1000"
          counter
        ></v-textarea>
      </v-col>

      <v-col cols="12">
        <v-autocomplete
          on
          :loading="loadingLocations"
          v-model="state.locations"
          @blur="v$.locations.$touch"
          @input="v$.locations.$touch"
          :error-messages="v$.locations.$errors.map((e) => e.$message)"
          :items="locations"
          bg-color="white"
          color="primary"
          item-title="name"
          item-value="name"
          :label="$t('locations')"
          chips
          closable-chips
          multiple
        >
        </v-autocomplete>
      </v-col>

      <v-col cols="12">
        <v-file-input
          :label="$t('documents')"
          v-model="state.documents"
          :error-messages="v$.documents.$errors.map((e) => e.$message)"
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

  <Snackbar :show="snackBar" color="success" :message="$t( isUpdating ? 'programUpdatedMessage' : 'programCreated')" />
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import getCountries from "@/services/location_service";
import { store } from "@/services/program_service";
import useVuelidate from "@vuelidate/core";
import { required, maxLength, requiredIf } from "@vuelidate/validators";
import { KeyValPair } from "@/types/KeyValPair";
import Snackbar from "@/views/components/snackbars/Default.vue";
import { Program } from "@/models/Program";
import DatePicker from "../components/inputs/DatePicker.vue";

const props = withDefaults(
  defineProps<{
    program?: Program;
    showSubmitBtn?: boolean;
    snackIt?: boolean;
  }>(),
  {
    showSubmitBtn: true,
    snackIt: true,
  }
);

const loadingLocations = ref(false);
const locations = ref();
const isUpdating = ref(false);
const isRequiredFields = ref(true);

const formState: ProgramFormFields = {
  id: `program/${Math.random()}`,
  name: "",
  start_date: null,
  end_date: null,
  funding: null,
  description: "",
  locations: null,
  documents: null,
};

const snackBar = ref(false);

const state = reactive({
  ...formState,
});

const checkIfDocIsRequired = () => {
  return props.program ? false : true;
};

const rules = {
  name: { required, maxlength: maxLength(500) },
  start_date: { required },
  end_date: { required },
  funding: { required },
  description: { required, maxlength: maxLength(1000) },
  locations: { required },
  documents: { requiredIfFunction: requiredIf(checkIfDocIsRequired) },
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
  if (v$.value.$invalid) return;
  isSubmitting.value = true;
  let res: KeyValPair = {};
  try {
    res = await store(isUpdating.value, state).then((res) => {
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

const getLocs = async () => {
  try {
    loadingLocations.value = true;
    await getCountries().then((loc) => {
      locations.value = loc;
      loadingLocations.value = false;
    });
  } catch (error) {
    loadingLocations.value = false;
    throw error;
  }
};

const populate = async () => {
  if (props.program) {
    let p = props.program;
    (state.id = p.id), (state.name = p.name);
    state.start_date = p.startDate;
    state.end_date = p.endDate;
    state.funding = p.fundingUSD;
    state.description = p.description;
    state.locations = p.locations;
    isRequiredFields.value = false;
    isUpdating.value = true;
  }
};

onMounted(async () => {
  await getLocs();
  await populate();
});

defineExpose({
  submit,
});
</script>
