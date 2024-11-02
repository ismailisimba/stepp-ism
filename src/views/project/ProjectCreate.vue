<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <PageHeader :text="pageTitle" class="pb-5" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6" align="end">
        <PageHeaderBtn
          v-if="answers"
          color="primary"
          icon="mdi-alpha-q-circle-outline"
          @click="showQuestionsModal = true"
          :text="$t('viewQuestions')"
        />
      </v-col>
    </v-row>

    <Loading v-if="isLoading" />
    <v-sheet flat v-else>
      <v-row>
        <v-col cols="12">
          <v-stepper v-model="step" :items="steps" mobile-breakpoint="sm">
            <template v-slot:item.1>
              <ProjectForm
                ref="projectForm"
                :project="project"
                :show-submit-btn="false"
              />
            </template>

            <template v-slot:item.2>
              <ProjectActivitiesForm
                v-if="projectDetails"
                @success="updateActivitiesList"
                @delete="deleteActivity"
                :min-date="projectDetails?.startDate as Date"
                :max-date="projectDetails?.endDate as Date"
                :activities="projectDetails ? projectDetails.activities as Activities : null"
              />
            </template>

            <template v-slot:actions>
              <div class="d-flex pa-5 mx-5">
                <v-btn
                  class="text-none"
                  prepend-icon="mdi-arrow-left-circle-outline"
                  :disabled="disablePreviousButton"
                  rounded="pill"
                  @click="previous()"
                  >{{ t("previous") }}</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  :loading="isSubmitting"
                  :disabled="disable"
                  class="text-none"
                  color="primary"
                  rounded="pill"
                  :append-icon="nextButtonIcon"
                  @click.prevent="next()"
                  >{{ nextButtonText }}</v-btn
                >
              </div>
            </template>
          </v-stepper>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>

  <QuestionsModal
    v-if="answers"
    @close="showQuestionsModal = false"
    :answers="answers"
    :show="showQuestionsModal"
  />

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
import PageHeader from "../components/others/PageHeader.vue";
import Snackbar from "../components/snackbars/Default.vue";
import ProjectForm from "./components/ProjectForm.vue";
import router from "@/router";
import { Project } from "@/models/Project";
import ProjectActivitiesForm from "./components/ProjectActivitiesForm.vue";
import { Activities, Activity } from "@/models/Activity";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import { defineAsyncComponent } from "vue";
import { getApplication } from "@/services/application_service";
import { Application } from "@/models/Application";
import { questions } from "@/services/solicitation_question_service";
import { ApplicationInfo } from "@/models/ApplicationInfo";
import { getProjectAnswers, storeProject } from "@/services/project_service";
import { objectToFormData } from "@/helpers/general";
import { dateFormFormat } from "@/helpers/dateFormats";

const QuestionsModal = defineAsyncComponent(
  () => import("./components/QuestionsModal.vue")
);

const route = useRoute();
const { t } = useI18n();

const step = ref<number>(1);
const steps = ref([t("projectInfo"), t("activities")]);
const isSubmitting = ref<boolean>(false);
const project = ref<Project>();
const app = ref<Application>();
const showQuestionsModal = ref<boolean>(false);
const projectForm = ref<InstanceType<typeof ProjectForm> | null>(null);
const projectDetails = ref<ProjectFormFields>();
const isGettingApp = ref<boolean>(false);
const isGettingAnswers = ref<boolean>(false);
const answers = ref<ApplicationInfo>();
const isUpdating = ref<boolean>(false);

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

const next = async () => {
  if (isLastStep.value) {
    if (projectDetails.value)
      if (projectDetails.value?.activities.length > 0) await submit();
      else showSnackBar("error", t("minimumActivityError"));
    return;
  }
  try {
    if (projectForm.value) {
      projectDetails.value = projectForm.value.getProject();
      step.value++;
    }
  } catch (error: any) {
    if (error?.code == "validation") {
      showSnackBar("error", error.message);
      return;
    }
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

const submit = async () => {
  try {
    isSubmitting.value = true;
    await storeProject(isUpdating.value, payload()).then((r) => {
      router.push({
        name: "projects.show",
        params: { projectId: r.id },
      });
      isSubmitting.value = false;
    });
  } catch (error) {
    isSubmitting.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

const previous = () => {
  step.value--;
};

const deleteActivity = (index: number) => {
  if (projectDetails.value) projectDetails.value.activities.splice(index, 1);
};

const updateActivitiesList = (activity: Activity, index: number | null) => {
  if (projectDetails.value)
    if (index) {
      projectDetails.value.activities[index] = activity;
    } else {
      projectDetails.value.activities.unshift(activity);
    }
};

const isLastStep = computed(() => {
  return step.value == steps.value.length;
});

const disable = computed(() => {
  if (isSubmitting.value) return true;
  return false;
});

const nextButtonText = computed(() => {
  if (isLastStep.value) return t("submit");
  return t("continue");
});

const pageTitle = computed(() => {
  if (isLoading.value) return "";
  if (project.value) return t("editProject");
  return t("createProject");
});

const nextButtonIcon = computed(() => {
  if (isLastStep.value) return "mdi-arrow-right-circle-outline";
  return "mdi-arrow-right-circle-outline";
});

const disablePreviousButton = computed(() => {
  if (step.value == 1 || isSubmitting.value == true) {
    return true;
  }
  return false;
});

const isLoading = computed(() => {
  if (isGettingAnswers.value || isGettingApp.value) return true;
  return false;
});

const getApp = async () => {
  isGettingApp.value = true;
  try {
    await getApplication(route.params.appId as string).then((res) => {
      app.value = res;
    });
  } catch (error) {
    isGettingApp.value = false;
    showSnackBar("error", t("generalErrorMessage"));
  }
};

const getProject = async () => {
  isGettingApp.value = true;
  try {
    await getProjectAnswers(route.params.projectAnswersUrl as string).then(
      (res) => {
        project.value = res;
      }
    );
  } catch (error) {
    isGettingApp.value = false;
    showSnackBar("error", t("generalErrorMessage"));
  }
};

const getAnswers = async () => {
  isGettingAnswers.value = true;
  try {
    await questions(app.value?.solicitationAnswers as string).then((res) => {
      isGettingAnswers.value = false;
      isGettingApp.value = false;
      answers.value = res;
    });
  } catch (error) {
    isGettingAnswers.value = false;
    isGettingApp.value = false;
    showSnackBar("error", t("generalErrorMessage"));
  }
};

onMounted(async () => {
  if (route.params.appId) {
    await getApp();
    if (app.value) await getAnswers();
    return;
  }

  if (route.params.projectAnswersUrl) {
    isUpdating.value = true;
    await getProject();
    if (project.value) {
      isGettingApp.value = false;
    }
  }
});

const payload = () => {
  let inputs = {
    Project_Name: projectDetails.value?.name,
    Description: projectDetails.value?.description,
    Start_Date: projectDetails.value?.startDate,
    End_Date: projectDetails.value?.endDate,
    Budget: projectDetails.value?.budget,
    Reporting_Schedule: projectDetails.value?.reportingSchedule?.toLowerCase(),
    status: projectDetails.value?.status?.toLowerCase(),
    Activity_Name: projectDetails.value?.activities.map((a) => a.name),
    Activity_Description: projectDetails.value?.activities.map(
      (a) => a.description
    ),
    Activity_Start_Date: projectDetails.value?.activities.map((a) =>
      dateFormFormat(a.startDate as Date).toString()
    ),
    Activity_End_Date: projectDetails.value?.activities.map((a) =>
      dateFormFormat(a.endDate as Date).toString()
    ),
    "Associated_Results/Outputs": projectDetails.value?.activities.map(
      (a) => a.associatedResults
    ),
    Associated_Outcomes: projectDetails.value?.activities.map(
      (a) => a.associatedOutcomes
    ),
    answerData: project.value
      ? project.value.answerData
      : JSON.stringify(answers.value),
    answerDataId: project.value
      ? project.value.answerDataId
      : app.value?.solicitationAnswers,
    projectId: project.value ? project.value.id : ""
  };
  let fd = objectToFormData(inputs);
  return fd;
};
</script>

<style scoped></style>
