<template>
  <QuestionOption
    v-for="(option, index) in modelValue"
    :model-value="option.text"
    :total="modelValue.length"
    :type="type"
    @remove="removeOption(index)"
    @update:model-value="updateModelValue($event, index)"
  />
  <v-row class="pa-0 ma-0">
    <v-col cols="12">
      <AddQuestionOptionButton :type="type" @click="addOption" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import QuestionOption from "@/views/components/inputs/QuestionOption.vue";
import AddQuestionOptionButton from "@/views/components/inputs/AddQuestionOptionButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  modelValue: any;
  type: string;
  errors: any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", payload: {}): void;
}>();

const addOption = () => {
  const newValue = [...props.modelValue];
  const defaultText = t("option") + " " + (newValue.length + 1);
  newValue.push({ text: defaultText });
  emit("update:modelValue", newValue);
};

const removeOption = (index: number) => {
  const newValue = [...props.modelValue];
  newValue.splice(index, 1);
  emit("update:modelValue", newValue);
};

const updateModelValue = (value: any, index: number) => {
  const newValue = [...props.modelValue];
  newValue[index].text = value;
  emit("update:modelValue", newValue);
};
</script>

<style scoped></style>
