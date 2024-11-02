<template>
  <v-container fluid>
    <v-row class="pb-3">
      <v-col cols="12">
        <PageHeader :text="pageTitle" />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <Loading v-if="isLoading" />

    <SWW v-if="!report || sections.length == 0" />

    <v-container fluid v-else>
      <v-stepper v-model="step" mobile-breakpoint="sm" :items="steps">
        <template v-slot:item.1>
          <v-container fluid>
            <ReportForm ref="reportForm" :description="report?.description" />
          </v-container>
        </template>
        <template v-slot:item.2>
          <v-container fluid>
            <ReportQuestionForm v-model="sections" />
          </v-container>
        </template>

        <template v-slot:actions>
          <div class="d-flex pa-5 mx-5">
            <v-btn
              class="text-none"
              prepend-icon="mdi-arrow-left-circle-outline"
              :disabled="disablePreviousButton"
              rounded="pill"
              @click="previous"
              >{{ t("previous") }}</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              class="text-none"
              color="primary"
              rounded="pill"
              append-icon="mdi-arrow-right-circle-outline"
              :loading="isSubmitting"
              @click.prevent="next()"
              >{{ nextButtonText }}</v-btn
            >
          </div>
        </template>
      </v-stepper>
    </v-container>
  </v-container>
  <Snackbar
    :color="snackBarColor"
    :message="snackBarMessage"
    :show="snackBarShow"
  />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { SnackbarColor } from "@/types/types";
import Loading from "@/views/components/loaders/default.vue";
import router from "@/router";
import Snackbar from "../components/snackbars/Default.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { Report } from "@/models/Report";
import ReportForm from "./components/ReportForm.vue";
import ReportQuestionForm from "./components/ReportQuestionForm.vue";
import {
  getReport,
  getReportQuestions,
  updateReport,
} from "@/services/report_service";
import { ReportSectionQuestions } from "@/models/ReportSectionQuestion";
import { useSchemaStore } from "@/store/schemaStore";
import { objectToFormData } from "@/helpers/general";
import SWW from "../errors/SWW.vue";
import { delayTime } from "@/constants/app_constants";

const route = useRoute();
const { t } = useI18n();
const step = ref<number>(1);
const steps = [t("reportInfo"), t("reportQuestions")];
const reportId = ref<string>(route.params.reportId as string);
const reportForm = ref<InstanceType<typeof ReportForm> | null>(null);
const reportDetails = ref<ReportFormFields>();
const isGettingReport = ref<boolean>(false);
const isGettingQuestions = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const report = ref<Report>();
const sections = ref<ReportSectionQuestions>([]);
const schemaStore = useSchemaStore();

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

const isLastStep = computed(() => {
  return step.value == steps.length;
});

const previous = () => {
  step.value--;
};

const next = async () => {
  if (!isLastStep.value) {
    try {
      if (reportForm.value) {
        reportDetails.value = reportForm.value.getReport();
        step.value++;
        return;
      }
    } catch (error: any) {
      if (error?.code == "validation") {
        showSnackBar("error", error.message);
        return;
      }
      showSnackBar("error", t("generalErrorMessage"));
      throw error;
    }
  }
  await submit();
};

const submit = async () => {
  hideSnackBar();
  try {
    isSubmitting.value = true;
    await updateReport(payload()).then((r) => {
      showSnackBar("success", t("reportUpdated"));
      isSubmitting.value = false;
      setTimeout(() => {
        router.push({
          name: "reports.show",
          params: { reportId: report.value?.id as string },
        });
      }, delayTime.redirect);
    });
  } catch (error) {
    isSubmitting.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    console.error(error);
  }
};

const disablePreviousButton = computed(() => {
  if (
    step.value == 1 ||
    (isSubmitting.value == true && isLoading.value == true)
  ) {
    return true;
  }
  return false;
});

const pageTitle = t("editReport");

const nextButtonText = computed(() => {
  if (step.value == 2) return t("finish");
  return t("continue");
});

const isLoading = computed(() => {
  if (isGettingQuestions.value == true || isGettingReport.value == true)
    return true;
  return false;
});

const getReportData = async () => {
  isGettingReport.value = true;
  try {
    await getReport(reportId.value).then((res) => {
      report.value = res;
      isGettingReport.value = false;
    });
  } catch (error) {
    isGettingReport.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

const getDefaultQuestions = async () => {
  isGettingQuestions.value = true;
  try {
    await getReport(reportId.value).then(async (res) => {
      await schemaStore.getSchema().then(() => {
        if (schemaStore.defaultReportQuestions)
          sections.value = schemaStore.defaultReportQuestions;
        isGettingQuestions.value = false;
      });
    });
  } catch (error) {
    isGettingQuestions.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

const getSavedQuestions = async () => {
  isGettingQuestions.value = true;
  try {
    await getReportQuestions(report.value?.reportData as string).then((res) => {
      sections.value = res;
      isGettingQuestions.value = false;
    });
  } catch (error) {
    sections.value = [];
    isGettingQuestions.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

onMounted(async () => {
  if (reportId.value) await getReportData();
  if (report.value)
    if (report.value.reportData) await getSavedQuestions();
    else await getDefaultQuestions();
});

const payload = () => {
  let inputs = {
    id_type: "STRING",
    id: report.value?.id,
    description_type: "STRING",
    description: reportDetails.value?.description,
    report_data_type: "STRING",
    report_data: report.value?.reportData || "",
    documents_type: "STRING",
    documents: reportDetails.value?.documents || "",
    contact_email_type: "STRING",
    contact_email: report.value?.contactEmail,
    contact_name_type: "STRING",
    contact_name: report.value?.contactName,
    project_id_type: "STRING",
    project_id: report.value?.projectId,
    solicitation_id_type: "STRING",
    solicitation_id: report.value?.solicitationId,
    application_id_type: "STRING",
    application_id: report.value?.applicationId,
    activities_type: "STRING",
    activities: JSON.stringify(report.value?.activities[0]),
    qJson: JSON.stringify({
      sections: [...sections.value],
    }),
  };
  return objectToFormData(inputs);
};
</script>

<style scoped></style>
