<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="showDialog"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="close()"></v-btn>
          <v-toolbar-title>{{ $t("questions") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn :text="$t('close')" variant="text" @click="close()"></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-sheet rounded v-for="section, index in answers.sections" border="md" class="pa-6 my-6 mx-auto">
            <h4 class="text-h5 font-weight-300 mb-4"> {{ section.title || `${$t('section')} ${index + 1} `}}</h4>
            <p class="mb-8" v-for="question, index in section.questions">
              <span class="text-disabled">{{ question.text }} </span>
              <br />
              {{ isArray(question.userInput) ? (question.userInput as Array<any>).join() : question.userInput }}
                <CopyToClipBtn :val="question.userInput"/> 
              </p>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import { ApplicationInfo } from "@/models/ApplicationInfo";
import { isArray } from "@/helpers/general";
import CopyToClipBtn from "@/views/components/buttons/CopyToClipBtn.vue";
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    show: boolean;
    answers: ApplicationInfo;
  }>(),
  {
    show: false,
  }
);

const showDialog = ref(false);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};


watch(
  () => props.show,
  (newValue) => {
    showDialog.value = newValue;
  }
);
</script>
