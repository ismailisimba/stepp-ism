<template>
  <v-container fluid>
    <Loading v-if="isGettingAnswers" />

    <div v-else>
      <MarksSubmittedError v-if="isSubmitted" />
      <v-row class="pb-3" v-else>
        <v-col cols="12">
          <PageHeader :text="t('applicationReview')" />
        </v-col>
        <v-col cols="12" v-if="sections.length > 0">
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
                <v-sheet
                  border
                  rounded
                  class="pa-5 my-5"
                  v-for="(question, i) in section.questions"
                >
                  <p class="text-medium-emphasis">
                    {{ question.text }}
                    <span v-if="question.markFull">
                      ({{ question.markFull }} {{ $t("mks") }})
                    </span>
                  </p>
                  <p>{{ question.userInput }}</p>

                  <!-- Marks -->
                  <v-text-field
                    type="number"
                    :label="$t('awardedMark')"
                    v-model="question.markAwarded"
                  ></v-text-field>

                  <!-- Comment -->
                  <v-textarea
                    :label="$t('addComments')"
                    v-model="question.markComment"
                  ></v-textarea>
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
    </div>
  </v-container>

  <Snackbar
    :color="snackBarColor"
    :message="snackBarMessage"
    :show="snackBarShow"
  />
</template>

<script setup lang="ts">
import Loading from "@/views/components/loaders/default.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { questions } from "@/services/solicitation_question_service";
import { SnackbarColor } from "@/types/types";
import MarksSubmittedError from "./components/MarksSubmittedError.vue";
import {
  applicantGenerateAnswersUrl,
  applicantGenerateMarksUrl,
} from "@/models/Application";
import {
  saveQuestionMarks,
  submitQuestionMarks,
} from "@/services/application_service";
import Snackbar from "../components/snackbars/Default.vue";
import { ApplicationInfo } from "@/models/ApplicationInfo";
import { helpers, maxLength, numeric, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import router from "@/router";

const route = useRoute();
const { t } = useI18n();
const isGettingAnswers = ref<boolean>(false);
const applicationInfo = ref<ApplicationInfo | null>(null);
const step = ref<number>(1);
const isSubmitting = ref<boolean>(false);
const isSaving = ref<boolean>(false);

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

const sections = computed(() => {
  return applicationInfo.value?.sections || [];
});

const isSubmitted = computed(() => {
  if (applicationInfo.value?.markSubmitStatus)
    if (applicationInfo.value?.markSubmitStatus === "submitted") return true;
  return false;
});

const isLastStep = computed(() => {
  return step.value == sections.value.length;
});

const disable = computed(() => {
  if (isGettingAnswers.value) return true;
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
    (isSubmitting.value == true && isGettingAnswers.value == true)
  ) {
    return true;
  }
  return false;
});

const rules = {
  sections: {
    $each: helpers.forEach({
      questions: {
        $each: helpers.forEach({
          markAwarded: { required, numeric },
          markComment: { maxLength: maxLength(1000) },
        }),
      },
    }),
  },
};

const v$ = useVuelidate(rules, { sections });

//Submit questions
const submit = async () => {
  hideSnackBar();
  v$.value.$touch();
  // if (v$.value.$invalid) {
  //   //console.log(v$.value.sections.$each.$response.$errors[0].questions[0].$response.$errors[0].markAwarded.map((e : any) => e.$message));
  //   console.log(
  //     v$.value.sections.$each.$response.$errors[0].questions[0].$response.$errors[1].markAwarded.map(
  //       (e: any) => e.$message
  //     )
  //   );
  //   showSnackBar("error", t("formValidationError"));
  //   return;
  // }
  // alert("Sawa");
  // return;

  try {
    isSubmitting.value = true;
    await submitQuestionMarks(
      route.params.solId as string,
      applicationInfo.value as ApplicationInfo
    ).then((r) => {
      showSnackBar("success", t("applicationSubmitSuccessMsg"));
      router.push({
        name: "applications",
      });
      isSubmitting.value = false;
    });
  } catch (error) {
    isSubmitting.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    throw error;
  }
};

const save = async (showAlert = true, updateSaving = true) => {
  hideSnackBar();
  try {
    if (updateSaving) isSaving.value = true;
    await saveQuestionMarks(
      route.params.solId as string,
      applicationInfo.value as ApplicationInfo
    ).then((r) => {
      if (showAlert) showSnackBar("success", t("SaveSuccessMessage"));
      isSaving.value = false;
      return true;
    });
  } catch (error) {
    isSaving.value = false;
    showSnackBar("error", t("generalErrorMessage"));
    return false;
  }
};

const next = async () => {
  if (isLastStep.value) {
    await submit();
    return;
  }
  try {
    await save(false, false).then(() => {
      step.value++;
      isSaving.value = false;
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

//Get questions
const getAnswers = async () => {
  try {
    isGettingAnswers.value = true;
    await questions(
      applicantGenerateAnswersUrl(
        route.params.solId as string,
        route.params.applicantEmail as string
      )
    ).then((r) => {
      applicationInfo.value = r;
      isGettingAnswers.value = false;
    });
  } catch (error: any) {
    showSnackBar("error", t("generalErrorMessage"));
    isGettingAnswers.value = false;
  }
};

//Get saved marks

const getSavedMarks = async () => {
  try {
    isGettingAnswers.value = true;
    await questions(
      applicantGenerateMarksUrl(
        route.params.solId as string,
        route.params.applicantEmail as string
      )
    ).then((r) => {
      isGettingAnswers.value = false;
      applicationInfo.value = r || null;
    });
  } catch (error: any) {
    if (error?.code == "none") {
      applicationInfo.value = null;
      return;
    }
    showSnackBar("error", t("generalErrorMessage"));
    isGettingAnswers.value = false;
    throw error;
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

onMounted(async () => {
  await getSavedMarks();
  if (applicationInfo.value == null) await getAnswers();
});
</script>

<style scoped></style>
