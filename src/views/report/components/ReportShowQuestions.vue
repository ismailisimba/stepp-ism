<template>
  <div>
    <v-card
      rounded="lg"
      variant="tonal"
      v-for="(section, index) in sections"
      class="my-5"
    >
      <v-card-title>
        {{ section.title ? section.title : `${$t("section")} ${index + 1}` }}
      </v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12 pb-3" v-for="(question, index) in section.questions">
            <p class="pb-1">
              {{index + 1}}. {{ question.text }}
            </p>

            <div v-if="question.userInput">
              <span class="font-italic font-weight-regular">{{ $t("answer") }}</span>
              <br />
              <p>
                {{ question.userInput }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ReportSectionQuestions } from "@/models/ReportSectionQuestion";

const props = defineProps<{
  sections: ReportSectionQuestions;
}>();
</script>

<style scoped></style>
