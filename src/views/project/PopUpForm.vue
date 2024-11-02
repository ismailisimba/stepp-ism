<template>
  <v-dialog v-model="showDialog" @click:outside="close()" max-width="700">
    <template v-slot:default="{ isActive }">
      <v-card :title="title">
        <v-card-text>
          <Form
            ref="form"
            :snack-it="false"
            :program="program"
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
import { Program, parseProgramFromObject } from "@/models/Program";
import Form from "./Form.vue";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import ProjectForm from "./components/ProjectForm.vue";
const { t } = useI18n();

const props = defineProps<{
  program?: Program;
  show: boolean;
}>();

const showDialog = ref(false);

const form = ref<InstanceType<typeof ProjectForm> | null>(null);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "succeed", payload: { res: any }): void;
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
      await form.value.submit().then((res: { id: any }) => {
        let program = parseProgramFromObject(res.id) || null;
        emit("succeed", { res: program });
      });
      isSaving.value = false;
    }
  } catch (error) {
    isSaving.value = false;
    emit("fail", { error: error });
  }
};
</script>
