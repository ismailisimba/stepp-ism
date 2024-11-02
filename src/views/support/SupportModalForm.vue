<template>
  <v-dialog v-model="showDialog" @click:outside="close()" max-width="700">
    <template v-slot:default="{ isActive }">
      <v-card :title="title">
        <v-card-text>
          <Form ref="form" :snack-it="false" :show-submit-btn="false" />
        </v-card-text>
        <v-card-actions>
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
            :text="$t('submit')"
            @click="submit()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <Snackbar
    :color="snackBarColor"
    :message="snackBarMessage"
    :show="snackBarShow"
  />
</template>

<script setup lang="ts">
import Form from "./SupportForm.vue";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import { SnackbarColor } from "@/types/types";
import Snackbar from "../components/snackbars/Default.vue";
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    show: boolean;
    snackIt?: boolean;
  }>(),
  {
    snackIt: true,
    show: false,
  }
);

const showDialog = ref(false);
const form = ref<InstanceType<typeof Form> | null>(null);
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
  if (props.snackIt) {
    snackBarColor.value = color;
    snackBarMessage.value = message;
    snackBarShow.value = true;
  }
};

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
  (e: "fail", payload: { error: any }): void;
}>();

const title = ref(t("sendSupportRequest"));
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
  await hideSnackBar()
  if (form.value) {
    try {
      isSaving.value = true;
      await form.value.submit().then(() => {
        showSnackBar("success", t("messageSentSuccessfully"));
        emit("success");
      });
      isSaving.value = false;
    } catch (error: any) {
      if (error?.code == "validation") {
        showSnackBar("error", error.message);
        isSaving.value = false;
        return;
      }
      showSnackBar("error", t('generalErrorMessage'));
      isSaving.value = false;

      throw error;
    }
  }
};
</script>
