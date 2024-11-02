<template>
  <v-dialog v-model="showDialog" @click:outside="close()" max-width="700">
    <template v-slot:default="{ isActive }">
      <v-card :title="title">
        <v-card-text>
          <ActivityForm :activity="activity" :min-date="minDate" :max-date="maxDate"
          ref="activityForm" :show-submit-btn="false" />
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="text-none"
            :disabled="isSaving"
            :text="$t('cancel')"
            @click="close"
          ></v-btn>
          <v-btn
            class="text-none"
            variant="flat"
            :disabled="isSaving"
            :loading="isSaving"
            color="primary"
            :text="$t('save')"
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
import ActivityForm from "./components/ActivityForm.vue";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import { SnackbarColor } from "@/types/types";
import Snackbar from "../components/snackbars/Default.vue";
import { Activity } from "@/models/Activity";
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    activity?: Activity | null;
    show: boolean;
    snackIt?: boolean;
    minDate: Date;
    maxDate: Date;
  }>(),
  {
    snackIt: true,
    show: false,
  }
);

const showDialog = ref(false);
const activityForm = ref<InstanceType<typeof ActivityForm> | null>(null);

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
  (e: "success", payload: Activity): void;
  (e: "fail", payload: { error: any }): void;
}>();

const title = ref(props.activity ? t("updateActivity") : t("addActivity"));
const isSaving = ref(false);

const close = () => {
  emit("close");
};

const submit = async () => {
  await hideSnackBar();
  if (activityForm.value) {
    try {
      //isSaving.value = true;
      //isSaving.value = false;
      const activity = activityForm.value.getActivity();
      emit("success", activity);
      close();
    } catch (error: any) {
      if (error?.code == "validation") {
        showSnackBar("error", error.message);
        isSaving.value = false;
        return;
      }
      showSnackBar("error", t("generalErrorMessage"));
      isSaving.value = false;
      throw error;
    }
  }
};

watch(
  () => props.show,
  (newValue) => {
    isSaving.value = false;
    showDialog.value = newValue;
  }
);
</script>
