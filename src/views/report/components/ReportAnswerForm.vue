<template>
  <v-col cols="12" v-for="(section, index) in modelValue">
    <v-card>
      <v-card-title>
        <v-chip color="primary" class="pa-5">
          <p class="text-subtitle-1">
            {{ t("section") }} {{ index + 1 }} {{ t("of") }}
            {{ modelValue.length }}
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

                <v-btn @click="addSection(index)">
                  <v-icon size="x-large" icon="mdi-view-list-outline"></v-icon>
                  <v-tooltip activator="parent" location="bottom">{{
                    t("addSection")
                  }}</v-tooltip>
                </v-btn>

                <v-btn
                  @click="deleteSection(index)"
                  v-if="modelValue.length > 1"
                >
                  <v-icon size="x-large" icon="mdi-trash-can-outline"></v-icon>
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
        <v-row>
          <v-col cols="12" v-for="(question, qIndex) in section.questions">
            <v-sheet border rounded class="pa-10">
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
                    v-model="question.wordLimit"
                    :label="t('fullMarks')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="" sm="12" md="4">
                  <v-row>
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
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { questionFieldType } from "@/constants/app_constants";
import { ReportSectionQuestions } from "@/models/ReportSectionQuestion";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import QuestionOptions from "./QuestionOptions.vue";

const props = defineProps<{
  modelValue: ReportSectionQuestions;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", payload: {}): void;
}>();
const { t } = useI18n();
const defaultQType = "multiple-choice";

const fieldTypes = computed(() => {
  return questionFieldType.map((q) => ({
    ...q,
    title: t(q.name),
  }));
});

const addSection = (index: number) => {
  props.modelValue.splice(index, 0, {
    title: null,
    questions: [
      {
        type: defaultQType,
        text: "",
        options: [{ text: t("option") + " " + 1 }],
        wordLimit: null,
      },
    ],
  });
};

const deleteSection = (index: number) => {
  props.modelValue.splice(index, 1);
};

const addQuestion = (sectionIndex: number) => {
  props.modelValue[sectionIndex].questions.unshift({
    type: defaultQType,
    text: "",
    options: [{ text: t("option") + " " + 1 }],
    wordLimit: null,
  });
};

const deleteQuestion = (sectionIndex: number, questionIndex: number) => {
  props.modelValue[sectionIndex].questions.splice(questionIndex, 1);
};
</script>

<style scoped></style>
