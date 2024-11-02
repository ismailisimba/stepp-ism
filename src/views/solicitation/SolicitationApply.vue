<template>
  <v-container fluid>
    <PageHeader :text="t('solicitationApply')" class="pb-5" />

    <Loading v-if="isLoading" />
    <v-sheet flat v-else>
      <ApplicationSubmittedError v-if="isApplied" />
      <v-sheet flat v-else>
        <v-row v-if="sections.length > 0">
          <v-col cols="12">
            <v-stepper v-model="step">
              <v-stepper-header>
                <template
                  v-for="(section, index) in sections"
                  :key="`${index}-step`"
                >
                  <v-stepper-item
                    :complete="step > index"
                    :title="
                      section.title
                        ? section.title
                        : `${t('section')} ${index + 1}`
                    "
                    :value="index + 1"
                  ></v-stepper-item>
                  <v-divider
                    v-if="index !== sections.length - 1"
                    :key="index"
                  ></v-divider>
                </template>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item
                  v-for="(section, index) in sections"
                  :key="`${index}-content`"
                  :value="index + 1"
                >
                  <v-sheet class="pa-5">
                    <QuestionInput
                      v-for="(question, index) in section.questions"
                      :question="question"
                    />
                  </v-sheet>
                </v-stepper-window-item>
              </v-stepper-window>

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
                    class="text-none mx-2"
                    :loading="isSaving"
                    :disabled="disable"
                    color="primary"
                    rounded="pill"
                    append-icon="mdi-content-save-outline"
                    variant="outlined"
                    @click.prevent="save()"
                    >{{ t("save") }}</v-btn
                  >
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
        <NoQuestionsError v-else />
      </v-sheet>
    </v-sheet>
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
import PageHeader from "../components/others/PageHeader.vue";
import QuestionInput from "./components/QuestionInput.vue";
import { Solicitation } from "@/models/Solicitation";
import NoQuestionsError from "./components/NoQuestionsError.vue";
import ApplicationSubmittedError from "./components/ApplicationSubmittedError.vue";
import {
  apply,
  getQuestions,
  getSavedAnswers,
  saveQuestionAnswers,
} from "@/services/solicitation_question_service";
import { get } from "@/services/solicitation_service";
import Snackbar from "../components/snackbars/Default.vue";
import { SolicitationQuestionSections } from "@/models/SolicitationQuestionSection";
import router from "@/router";

const route = useRoute();
const { t } = useI18n();

const step = ref<number>(1);
const isGettingQuestions = ref<boolean>(false);
const isGettingSavedAnswers = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const isGettingSol = ref<boolean>(false);
const isApplied = ref<boolean>(true);
const isSaving = ref<boolean>(false);
const solicitation = ref<Solicitation>();
const sections = ref<SolicitationQuestionSections>([]);

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
    await submit();
    return;
  }
  try {
    isSubmitting.value = true;
    await save(false, false).then(() => {
      step.value++;
      isSubmitting.value = false;
    });
  } catch (error) {
    showSnackBar("error", t("generalErrorMessage"));
    isSubmitting.value = false;
    throw error;
  }
};

const previous = () => {
  step.value--;
};

const isLastStep = computed(() => {
  return step.value == sections.value.length;
});

const disable = computed(() => {
  if (
    isSaving.value ||
    isSubmitting.value ||
    isGettingQuestions.value ||
    isGettingSavedAnswers.value
  )
    return true;
  return false;
});

const nextButtonText = computed(() => {
  if (isLastStep.value) return t("submit");
  return t("continue");
});

const nextButtonIcon = computed(() => {
  if (isLastStep.value) return "mdi-arrow-right-circle-outline";
  return "mdi-content-save-move-outline";
});

const disablePreviousButton = computed(() => {
  if (
    step.value == 1 ||
    (isSubmitting.value == true && isGettingQuestions.value == true)
  ) {
    return true;
  }
  return false;
});

const isLoading = computed(() => {
  if (
    isGettingSavedAnswers.value ||
    isGettingQuestions.value ||
    isGettingSol.value
  )
    return true;
  return false;
});

//Get saved questions
const getAnswers = async () => {
  hideSnackBar();
  try {
    isGettingSavedAnswers.value = true;
    await getSavedAnswers(solicitation.value?.id as string).then((r) => {
      if (r.canEdit) {
        sections.value = r.answers;
        isApplied.value = false;
      } else {
        isApplied.value = true;
      }
      isGettingSavedAnswers.value = false;
    });
  } catch (error: any) {
    switch (error?.code || 0) {
      case "empty":
        isApplied.value = false;
        break;
      default:
        showSnackBar("error", t("generalErrorMessage"));
        throw error;
    }
    isGettingSavedAnswers.value = false;
  }
};

//Get questions
const getQs = async () => {
  isGettingQuestions.value = true;
  try {
    await getQuestions(solicitation.value?.questions[0] || "").then((res) => {
      isGettingQuestions.value = false;
      sections.value = res;
    });
  } catch (error) {
    isGettingQuestions.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

//Save questions
const save = async (showAlert = true, updateSaving = true) => {
  hideSnackBar();
  try {
    if (updateSaving) isSaving.value = true;
    await saveQuestionAnswers(
      sections.value,
      solicitation.value as Solicitation
    ).then((r) => {
      if (r.success) {
        if (showAlert)
          showSnackBar("success", t("applicationSaveSuccessMessage"));
        isSaving.value = false;
        return true;
      } else {
        if (showAlert) showSnackBar("error", t("generalErrorMessage"));
      }
      isSaving.value = false;
      return false;
    });
  } catch (error) {
    isSaving.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    return true;
  }
};

//Submit questions
const submit = async () => {
  hideSnackBar();
  try {
    isSubmitting.value = true;
    await apply(sections.value, solicitation.value as Solicitation).then(
      (r) => {
       if(r.success){
        router.push({name : 'applications.show', params: {'appId' : r.application.id}})
       }
       showSnackBar("error", t("generalErrorMessage"));
      });
  } catch (error) {
    isSubmitting.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

const getSol = async () => {
  isGettingSol.value = true;
  try {
    await get(route.params.solId as string).then((sol: Solicitation) => {
      isGettingSol.value = false;
      solicitation.value = sol;
    });
  } catch (error) {
    isGettingSol.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

onMounted(async () => {
  await getSol();
  if (solicitation.value) await getAnswers();
  if (
    solicitation.value &&
    sections.value.length == 0 &&
    isApplied.value == false
  )
    await getQs();
});
</script>

<style scoped></style>
