<template>
  <Loading v-if="isLoadingQuestions" />
  <v-row v-else>
    <p class="pa-4 w-100 text-subtitle-1">
     <span class="text-disabled"> {{ t('solicitationName') }} </span> :
       {{ solName }}</p>
    <v-col cols="12" v-for="(section, index) in sections">
      <v-card :loading="isSubmiting && showSubmitBtn" :disabled="isSubmiting">
        <v-card-title>
          <v-chip color="primary" class="pa-5">
            <p class="text-subtitle-1">
              {{ t("section") }} {{ index + 1 }} {{ t("of") }}
              {{ sections.length }}
            </p>
          </v-chip>
        </v-card-title>

        <v-card-actions>
          <v-container>
            <v-row>
              <v-col sm="12" md="6" order-sm="last" order-md="first">
                <v-text-field
                  type="text"
                  v-model="section.title"
                  :label="t('sectionName')"
                  @blur="
                    v$.sections.$each.$response.$errors[index].title.$touch
                  "
                  @input="
                    v$.sections.$each.$response.$errors[index].title.$touch
                  "
                  :error-messages="v$.sections.$each.$response.$errors[index].title.map((e : any) => e.$message)"
                ></v-text-field>
              </v-col>
              <v-col sm="12" md="6" order-sm="first" order-md="last">
                <v-btn-toggle variant="outlined" base-color="primary" divided>
                  <v-btn @click="addQuestion(index)">
                    <v-icon size="x-large" icon="mdi-plus"></v-icon>
                    <v-tooltip activator="parent" location="bottom">{{
                      t("addQuestion")
                    }}</v-tooltip>
                  </v-btn>

                  <v-btn  @click="addSection(index)">
                    <v-icon
                      size="x-large"
                      icon="mdi-view-list-outline"
                    ></v-icon>
                    <v-tooltip activator="parent" location="bottom">{{
                      t("addSection")
                    }}</v-tooltip>
                  </v-btn>

                  <v-btn
                    @click="showOrderSectionsModal = true"
                    v-if="sections.length > 1"
                  >
                    <v-icon
                      size="x-large"
                      icon="mdi-arrow-up-down-bold-outline"
                    ></v-icon>
                    <v-tooltip activator="parent" location="bottom">{{
                      t("moveSection")
                    }}</v-tooltip>
                  </v-btn>

                  <v-btn
                    @click="deleteSection(index)"
                    v-if="sections.length > 1"
                  >
                    <v-icon
                      size="x-large"
                      icon="mdi-trash-can-outline"
                    ></v-icon>
                    <v-tooltip activator="parent" location="bottom">{{
                      t("deleteSection")
                    }}</v-tooltip>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
        <v-card-text>
          <draggable
            v-model="section.questions"
            :animation="200"
            :component-data="{ name: 'fade' }"
            item-key="id"
            handle=".move"
          >
            <template #item="{ element: question, index: qIndex }">
              <v-col cols="12">
                <v-sheet border rounded class="py-3 px-5">
                  <v-row v-if="section.questions.length > 1">
                    <v-col cols="12" class="text-center">
                      <v-icon
                        size="18"
                        class="move"
                        icon="mdi-dots-grid"
                      ></v-icon>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col sm="12" md="8" order-sm="last" order-md="first">
                      <v-text-field
                        v-model="question.text"
                        :label="t('question')"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="12" md="4" order-sm="first" order-md="last">
                      <v-select
                        v-model="question.type"
                        :items="fieldTypes"
                        item-title="title"
                        item-value="value"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      v-if="
                        question.type == 'multiple-choice' ||
                        question.type == 'multiple-choice-one'
                      "
                    >
                      <QuestionOptions
                        v-model="question.options"
                        :type="question.type"
                        :errors="[]"
                      />
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="8">
                      <v-text-field
                        type="number"
                        v-model="question.markFull"
                        :label="t('fullMarks')"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="" sm="12" md="4">
                      <v-row>
                        <v-col cols="8"
                          ><v-checkbox
                            v-model="question.required"
                            label="Required"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="4" class="text-right">
                          <v-btn
                            variant="text"
                            icon
                            v-if="section.questions.length > 1"
                          >
                            <v-icon
                              size="x-large"
                              icon="mdi-trash-can-outline"
                              @click="deleteQuestion(index, qIndex)"
                            ></v-icon>
                            <v-tooltip activator="parent" location="bottom">{{
                              t("deleteQuestion")
                            }}</v-tooltip>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>
            </template>
          </draggable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-btn
    class="ma-5"
    v-if="showSubmitBtn"
    :loading="isSubmiting"
    color="primary"
    @click="submit"
    >Submit
  </v-btn>

  <OrderSolQuestionsSections
    v-model="sections"
    :show="showOrderSectionsModal"
    @close="showOrderSectionsModal = false"
  />
</template>
<script setup lang="ts">
import Loading from "@/views/components/loaders/default.vue";
import { questionFieldType } from "@/constants/app_constants";
import { SolicitationQuestionOptions } from "@/models/SolicitationQuestionOption";
import QuestionOptions from "./QuestionOptions.vue";
import { SolicitationQuestionSection } from "@/models/SolicitationQuestionSection";
import { computed, defineAsyncComponent, onMounted } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { helpers, maxLength, numeric, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import router from "@/router";
import { SnackbarColor } from "@/types/types";
import {
  getQuestions,
  updateQuestions,
} from "@/services/solicitation_question_service";
import draggable from "vuedraggable";

const OrderSolQuestionsSections = defineAsyncComponent(
  () => import("@/views/components/others/OrderSolQuestionsSections.vue")
);

const props = withDefaults(
  defineProps<{
    solId: string;
    solName: string;
    questionUrl?: string | null;
    isUpdating: boolean;
    showSubmitBtn?: boolean;
  }>(),
  {
    showSubmitBtn: false,
  }
);

const { t } = useI18n();
const showOrderSectionsModal = ref(false);

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
  snackBarMessage.value = "message";
  snackBarShow.value = true;
};

// const sections = reactive(<Array<SolicitationQuestionSection>>([]));

const defaultQType = "multiple-choice";
const isSubmiting = ref(false);

const sections = ref<Array<SolicitationQuestionSection>>([
  {
    title: null,
    questions: [
      {
        type: defaultQType,
        text: "",
        options: [
          { text: t("option") + " " + 1 },
        ] as SolicitationQuestionOptions,
        required: false,
        markFull: null,
      },
    ],
  },
]);
const rules = {
  sections: {
    $each: helpers.forEach({
      title: { maxLength: maxLength(191) },
      questions: {
        $each: helpers.forEach({
          text: { required, maxLength: maxLength(191) },
          markFull: { required, numeric },
          options: {
            $each: helpers.forEach({
              text: { required, maxLength: maxLength(191) },
            }),
          },
        }),
      },
    }),
  },
};

const v$ = useVuelidate(rules, { sections });

const submit = async () => {
  v$.value.$touch();
  try {
    isSubmiting.value = true;
    await updateQuestions(sections.value, props.solId).then((r) => {
      router.push({
        name: "solicitations.show",
        params: { solId: props.solId },
      });
      isSubmiting.value = false;
    });
  } catch (error) {
    isSubmiting.value = false;
    console.log(error,"err")
    let errorMessage = "";

// Check if the error is an Axios error with a response
if (error.response && error.response.data) {
  // If the server provided an error message, use it
  if (error.response.data.message) {
    errorMessage = error.response.data.message;
  } else {
    // Fallback to a generic message if no specific message is provided
    errorMessage = t("generalErrorMessage");
  }
} else if (error.message) {
  // For non-Axios errors or errors without a response
  errorMessage = error.message;
} else {
  // Final fallback
  errorMessage = t("generalErrorMessage");
}

showSnackBar("error", errorMessage);
throw error;
  }
};

const fieldTypes = computed(() => {
  return questionFieldType.map((q) => ({
    ...q,
    title: t(q.name),
  }));
});

const addSection = (index: number) => {
  sections.value.splice(index, 0, {
    title: null,
    questions: [
      {
        type: defaultQType,
        text: "",
        options: [
          { text: t("option") + " " + 1 },
        ] as SolicitationQuestionOptions,
        required: false,
        markFull: null,
      },
    ],
    //name: "",
  });
};

const deleteSection = (index: number) => {
  sections.value.splice(index, 1);
};

const addQuestion = (sectionIndex: number) => {
  sections.value[sectionIndex].questions.unshift({
    type: defaultQType,
    text: "",
    options: [{ text: t("option") + " " + 1 }] as SolicitationQuestionOptions,
    required: false,
    markFull: null,
  });
};

const deleteQuestion = (sectionIndex: number, questionIndex: number) => {
  sections.value[sectionIndex].questions.splice(questionIndex, 1);
};

//Question
const isLoadingQuestions = ref<boolean>(false);
const getSections = async () => {
  isLoadingQuestions.value = true;
  try {
    await getQuestions(props.questionUrl || "").then((r) => {
      sections.value = r;
      isLoadingQuestions.value = false;
    });
  } catch (error) {
    isLoadingQuestions.value = false;
    //showSnackBar("error", t("generalErrorMessage"))
  }
};
//End question

onMounted(() => {
  if (props.isUpdating && props.questionUrl) {
    getSections();
  }
});

defineExpose({
  submit,
});
</script>
