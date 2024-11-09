<template>
  <v-dialog v-model="showDialog" @click:outside="close()" max-width="700">
    <template v-slot:default="{ isActive }">
      <v-card :title="title">
        <v-card-text>
          <ProgramForm
            ref="form"
            :snack-it="false"
            :program="program"
            :documents="documents"
            :redirect-on-success="false"
            :show-submit-btn="false"
          />

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="isSaving"
            :text="$t('cancel')"
            @click="close"
          ></v-btn>
          <v-btn
            variant="flat"
            :disabled="isSaving"
            :loading="isSaving"
            color="primary"
            :text="$t(program ? 'save' : 'submit')"
            @click="submit"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { Program } from "@/models/Program";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import ProgramForm from "./components/ProgramForm.vue";
import { FileInfo } from '@/models/FileInfo';


const { t } = useI18n();
const props = defineProps<{
  program?: Program;
  documents?: Array<FileInfo>;
  show: boolean;
}>();

const showDialog = ref(false);

const form = ref<InstanceType<typeof ProgramForm> | null>(null);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "succeed", payload: Program): void;
  (e: "fail", payload: { error: any }): void;
}>();

const title = ref(props.program ? t("editProgram") : t("addProgram"));

const isSaving = ref(false);

const close = () => {
  emit("close");
};

watch(
  () => props.show,
  (newValue) => {
    isSaving.value = false;
    showDialog.value = newValue;
  }
);

const submit = async () => {
  try {
    isSaving.value = true;
    if (form.value) {
      await form.value.submit().then((res: Program) => {
        emit("succeed", res);
      });
      isSaving.value = false;
    }
  } catch (error: any) {
    isSaving.value = false;
    if (error.code !== "Validation") emit("fail", { error: error });
    console.error(error);
  }
};
</script>
