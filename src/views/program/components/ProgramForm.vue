<template>
  <v-form :disabled="disableForm">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.name"
          :label="$t('programName')"
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
          :label="$t('fundingUSD')"
          v-model="state.total_funding_usd"
          @blur="v$.total_funding_usd.$touch"
          @input="v$.total_funding_usd.$touch"
          :error-messages="v$.total_funding_usd.$errors.map((e : any) => e.$message)"
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
          :error-messages="v$.description.$errors.map((e : any) => e.$message)"
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
          :error-messages="v$.locations.$errors.map((e : any) => e.$message)"
          :items="locations"
          bg-color="white"
          color="primary"
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
      <v-list-item-content>
        <v-list-item-title>{{ doc.filename }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          variant="plain"
          icon="mdi-download"
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
          bg-color="white"
          color="primary"
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

    <div class="text-left pa-0" v-if="showSubmitBtn">
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
import { onMounted, ref, reactive, computed } from "vue";
import axios from 'axios'; // Import axios
import getCountries from "@/services/location_service";
import { store } from "@/services/program_service";
import useVuelidate from "@vuelidate/core";
import { required, maxLength, requiredIf } from "@vuelidate/validators";
import Snackbar from "@/views/components/snackbars/Default.vue";
import { Program } from "@/models/Program";
import DatePicker from "@/views/components/inputs/DatePicker.vue";
import { dateAfter } from "@/helpers/validators";
import { useI18n } from "vue-i18n";
import { SnackbarColor } from "@/types/types";
import router from "@/router";
import { delayTime } from "@/constants/app_constants";
import { objectToFormData } from "@/helpers/general";
import { CustomException } from "@/helpers/errorHelper";
import { downloadFile } from '@/services/file_service'; // Import downloadFile
import { FileInfo } from '@/models/FileInfo'; // Import FileInfo


const props = withDefaults(
  defineProps<{
    program?: Program;
    showSubmitBtn?: boolean;
    snackIt?: boolean;
    redirectOnSuccess?: boolean;
    documents?:Array<FileInfo>;
  }>(),
  {
    showSubmitBtn: true,
    snackIt: true,
    redirectOnSuccess: true,
  }
);

const existingDocuments = ref<Array<FileInfo>>();


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



const loadingLocations = ref(false);
const locations = ref();
const isUpdating = ref(false);
const isRequiredFields = ref(true);
const { t } = useI18n();
const formState: ProgramFormFields = {
  id: `program/${Math.random()}`,
  name: "",
  start_date: null,
  end_date: null,
  total_funding_usd: null,
  description: "",
  status: "draft",
  locations: null,
  fileInput: null,
};

const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");
const state = reactive({
  ...formState,
});

const checkIfDocIsRequired = () => {
  return true;
  // return props.program ? false : true;
};

const rules = computed(() => ({
  name: { required, maxlength: maxLength(500) },
  start_date: { required },
  end_date: { required, dateAfter: dateAfter(state.start_date as Date, t) },
  total_funding_usd: { required },
  description: { required, maxlength: maxLength(1000) },
  locations: { required },
  status: { required },
  fileInput: { requiredIfFunction: requiredIf(checkIfDocIsRequired) },
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

const submit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid){
    showSnackBar('error', t('formValidationError'));
    throw CustomException(t('formValidationError'), 'Validation');
  }
  isSubmitting.value = true;
  let res: Program;
  try {
    res = await store(isUpdating.value, getPayload()).then((p) => {
      isSubmitting.value = false;
      if (props.snackIt) {
        showSnackBar(
          "success",
          t(isUpdating ? "programUpdatedMessage" : "programCreated")
        );
      }
      if (props.redirectOnSuccess) {
        setTimeout(() => {
          router.push({
            name: "programs.show",
            params: { programId: p.id as string },
          });
        }, delayTime.redirect);
      }
      return p;
    });
  } catch (error: any) {
    showSnackBar("error", t("generalErrorMessage"));
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
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

const populate = async () => {
  if (props.program) {
    let p = props.program;
    (state.id = p.id), (state.name = p.name);
    state.start_date = p.startDate;
    state.end_date = p.endDate;
    state.total_funding_usd = p.fundingUSD;
    state.description = p.description;
    state.locations = p.locations;
    state.status = p.status;
    isRequiredFields.value = false;
    isUpdating.value = true;
  }
};

const getPayload = () => {
  let payload = objectToFormData(state);

   // Append existing document IDs if necessary
   /*if (existingDocuments.value && existingDocuments.value.length > 0) {
    existingDocuments.value.forEach((doc) => {
      payload.append('existingDocumentIds', doc.id);
    });
  }*/


  payload.append("id_type", "STRING");
  payload.append("name_type", "STRING");
  payload.append("start_date_type", "DATE");
  payload.append("end_date_type", "DATE");
  payload.append("total_funding_usd_type", "INTEGER");
  payload.append("description_type", "STRING");
  payload.append("status_type", "STRING");
  payload.append("locations_type", "STRING");
  payload.append("solicitations_type", "STRING");
  payload.append("solicitations", "to_be_filled_later");
  payload.append("documents_type", "STRING");
  return payload;
};

onMounted(async () => {
  await getLocs();
  await populate();

  if (props.documents) {
    existingDocuments.value = props.documents.map(doc => ({
      ...doc,
      isDownloading: false,
    }));

    // Fetch binaries and create File objects
    const existingFiles = await Promise.all(
      existingDocuments.value.map(async (doc) => {
        const blob = await downloadFileAsBlob(doc.id);
        return new File([blob], doc.filename, { type: blob.type });
      })
    );

    // Assign existing files to state.fileInput
    if (state.fileInput) {
      state.fileInput = [...existingFiles, ...state.fileInput];
    } else {
      state.fileInput = existingFiles;
    }
  }
  console.log(props, "mm");
});


const downloadFileAsBlob = async (fileId: string): Promise<Blob> => {
  try {
    const response = await axios.get(
      `https://grantman-czivjdfhnq-ez.a.run.app/public_files/${encodeURIComponent(fileId)}`,
      {
        responseType: 'blob',
        // Include any necessary headers or authentication tokens
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error downloading file as blob:', error);
    throw error;
  }
};


defineExpose<{
  submit: () => Promise<any>;
}>({
  submit,
});
</script>
