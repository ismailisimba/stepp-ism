<template>
  <!-- Short paragraph -->
  <v-text-field
    v-if="fieldType?.value == 'short-paragraph'"
    type="text"
    v-model="question.userInput"
    :label="question.text"
    :required="'required' in question ? question.required : false"
  ></v-text-field>

  <!-- Number -->
  <v-text-field
    v-if="fieldType?.value == 'number'"
    type="number"
    :label="question.text"
    v-model="question.userInput"
    :required="'required' in question ? question.required : false"
  ></v-text-field>

  <!-- Paragraph -->
  <v-textarea
    v-if="fieldType?.value == 'paragraph'"
    :label="question.text"
    v-model="question.userInput"
    :maxlength="fieldType?.maxLength"
    counter
    :required="'required' in question ? question.required : false"
  ></v-textarea>

  <!-- Date -->
  <DatePicker
    v-if="fieldType?.value == 'date'"
    v-model="question.userInput as Date"
    :label="question.text || ''"
  />

  <!-- File Upload -->
  <v-file-input
    v-if="fieldType?.value == 'upload'"
    v-model="question.userInput"
    :label="question.text"
    show-size
    :required="'required' in question ? question.required : false"
  >
  </v-file-input>

  <!-- Multiple choice One -->
  <v-radio-group
    v-model="question.userInput"
    v-if="fieldType?.value == 'multiple-choice-one'"
  >
    <template v-slot:label>
      <div>{{ question.text }}</div>
    </template>
    <v-radio v-for="option in question.options" :value="option.text">
      <template v-slot:label>
        <div>{{ option.text }}</div>
      </template>
    </v-radio>
  </v-radio-group>

  <!-- Multiple choice -->
  <v-select
    v-if="fieldType?.value == 'multiple-choice'"
    :label="question.text"
    v-model="question.userInput"
    :items="question.options"
    item-title="text"
    item-value="text"
    multiple
    persistent-hint
  ></v-select>
</template>

<script setup lang="ts">
import { questionFieldType } from "@/constants/app_constants";
import { ReportQuestion } from "@/models/ReportQuestion";
import { SolicitationQuestion } from "@/models/SolicitationQuestion";
import DatePicker from "@/views/components/inputs/DatePicker.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  question: SolicitationQuestion | ReportQuestion;
}>();

const fieldType = computed(() => {
  return questionFieldType.find((q) => {
    return q.value == props.question.type;
  });
});

const radio = ref();
</script>

<style scoped></style>
