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

      <v-col cols="12" v-if="existingDocuments && existingDocuments.length > 0">
  <p class="text-subtitle-1 font-weight-medium">
    {{ $t('existingDocuments') }}:
  </p>
  <v-list class="pa-0" color="transparent">
    <v-list-item
      v-for="(doc, index) in existingDocuments"
      :key="doc.id || index"
    >

        <v-list-item-title>{{ doc.filename }}</v-list-item-title>
      
      <v-list-item-action>
        <v-btn
          variant="plain"
          icon="mdi-download"
          :loading="doc.isDownloading"
          @click="downloadExistingDoc(index, doc.id, doc.filename)"
        ></v-btn>
        <v-btn
          variant="plain"
          icon="mdi-close"
          @click="removeExistingDoc(index)"
        ></v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
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
// Import at the top of your script
import { FileInfo } from '@/models/FileInfo';
import { getFilesInfo, downloadFile } from '@/services/file_service';
import { SnackbarColor } from "@/types/types";
import axios from 'axios';

const { t } = useI18n();
const countryStore = useCountryStore();

countryStore.loadCountries();

const { isLoading: isLoadingCountries, countries } = storeToRefs(countryStore);

const existingDocuments = ref<Array<FileInfo>>([]);


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


const downloadExistingDoc = async (index: number, fileId: string, filename: string) => {
  try {
    existingDocuments.value[index].isDownloading = true;
    await downloadFile(fileId, filename);
  } catch (error) {
    showSnackBar('error', t('errorDownloadingDocument'));
  } finally {
    existingDocuments.value[index].isDownloading = false;
  }
};

const removeExistingDoc = (index: number) => {
  const removedDoc = existingDocuments.value.splice(index, 1)[0];

  // Remove the corresponding File from state.fileInput
  if (state.fileInput) {
    state.fileInput = state.fileInput.filter(file => file.name !== removedDoc.filename);
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
  console.log(props, "mm")
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
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

const showSnackBar = (color: SnackbarColor, message: string) => {
  snackBarColor.value = color;
  snackBarMessage.value = message;
  snackBarShow.value = true;
};


const downloadFileAsFile = async (fileId: string, filename: string): Promise<File> => {
  try {
    const response = await axios.get(
      `https://grantman-czivjdfhnq-ez.a.run.app/public_files/${encodeURIComponent(fileId)}`,
      {
        responseType: 'blob',
        // Include any necessary headers or authentication tokens
      }
    );
    const blob = response.data;
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error downloading file as file:', error);
    throw error;
  }
};


onMounted(async () => {
  await loadPrograms();
  await populate();

  if (props.solicitation && props.solicitation.documents && props.solicitation.documents.length > 0) {
    try {
      const docsInfo = await getFilesInfo(props.solicitation.documents);
      existingDocuments.value = docsInfo.map(doc => ({
        ...doc,
        isDownloading: false,
      }));

      // Fetch binaries and create File objects
      const existingFiles = await Promise.all(
        existingDocuments.value.map(async (doc) => {
          const file = await downloadFileAsFile(doc.id, doc.filename);
          return file;
        })
      );

      // Assign existing files to state.fileInput
      if (state.fileInput) {
        state.fileInput = [...existingFiles, ...state.fileInput];
      } else {
        state.fileInput = existingFiles;
      }

    } catch (error) {
      console.error('Error fetching document info:', error);
      showSnackBar('error', t('errorFetchingDocuments'));
    }
  }
});



defineExpose({
  submit,
});
</script>
