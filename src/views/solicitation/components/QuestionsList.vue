<template>
  <v-timeline align="start" density="compact" class="w-100">
    <v-timeline-item
      v-for="(section, index) in sections"
      dot-color="primary"
      size="small"
      width="100%"
    >
      <div class="mb-4">
        <div class="font-weight-normal">
          <strong class="text-h6">{{
            section.title ? section.title : `${$t("section")} ${index + 1}`
          }}</strong>
        </div>
        <v-table>
          <thead>
            <tr>
              <th style="width: 10%">#</th>
              <th
                style="width: 35%"
                class="text-left font-weight-bold text-uppercase"
              >
                {{ $t("question") }}
              </th>
              <th
                style="width: 25%"
                class="text-left font-weight-bold text-uppercase"
              >
                {{ $t("options") }}
              </th>
              <th style="width: 15%" class="text-left text-uppercase">
                {{ $t("type") }}
              </th>
              <th style="width: 10%" class="text-left text-uppercase">
                {{ $t("fullMarks") }}
              </th>
              <th style="width: 10%" class="text-left text-uppercase">
                {{ $t("required") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in section.questions">
              <td>{{ index + 1 }}</td>
              <td>
                {{ question.text }}
              </td>
              <td>
                <ol class="pl-7" v-if="question.type == 'multiple-choice' || question.type == 'multiple-choice-one'">
                  <li v-for="option in question.options">{{ option.text }}</li>
                </ol>
              </td>
              <td>{{ $t(getTypeText(question.type)) }}</td>
              <td>{{ question.markFull }}</td>
              <td class="px-10">
                {{ question.required ? $t("yes") : $t("no") }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
import { camelCase, firstLetterLowerCase } from "@/helpers/stringHelper";
import { SolicitationQuestionSections } from "@/models/SolicitationQuestionSection";

const props = defineProps<{
  sections: SolicitationQuestionSections;
}>();

const getTypeText = (type: string) => {
  return firstLetterLowerCase(
    camelCase(type.replaceAll("-", " ")).replaceAll(" ", "")
  );
};
</script>

<style scoped></style>
