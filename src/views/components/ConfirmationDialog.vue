<template>
  <v-dialog v-model="showDialog" @click:outside="close()" max-width="500px">
    <template v-slot:activator="{ props: activatorProps }">
      <PageHeaderBtn
        v-if="isPageHeader"
        color="primary"
        :icon="icon"
        :text="launchBtnText"
        @click="showDialog = true"
        v-bind="activatorProps"
      />

      <v-btn
        v-else
        :prepend-icon="icon"
        :text="launchBtnText"
        :color="btnColor"
        :rounded="rounded"
        v-bind="activatorProps"
      ></v-btn>
    </template>
    <v-card rounded="" class="pt-3">
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>
      <v-card-subtitle v-if="subtitle">
        {{ subtitle }}
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="isBusy"
          color="blue-darken-1"
          variant="text"
          @click="close"
        >
          {{ btnCancelText ?? t("cancel") }}
        </v-btn>
        <v-btn
          :disabled="isBusy"
          :loading="isBusy"
          rounded="pill"
          color="primary"
          variant="tonal"
          @click="query"
          >{{ btnOkText ?? t("ok") }}</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { extractAxiosData } from "@/helpers/extractAxiosData";
import axios from "axios";
import { watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import PageHeaderBtn from "./buttons/PageHeaderBtn.vue";
import { SnackbarColor } from "@/types/types";
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    url: string;
    launchBtnText: string;
    btnCancelText?: string;
    btnOkText?: string;
    btnColor?: string;
    rounded?: string;
    icon?: string;
    isPageHeader?: boolean;
  }>(),
  {
    isPageHeader: true,
    btnColor: "primary",
    rounded: "pill",
  }
);

const isBusy = ref(false);
const showDialog = ref(false);
//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

// Define emits
const emit = defineEmits<{
  (e: "close"): void;
  (e: "success", payload: { res: any }): void;
  (e: "fail", payload: { error: any }): void;
}>();

const close = () => {
  showDialog.value = false;
  emit("close");
};

const query = async () => {
  isBusy.value = true;
  try {
    await axios.get(props.url).then((r) => {
      if (r.status != 200) {
        emit("fail", r.status as any);
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      extractAxiosData(r) || [];
      emit("success", extractAxiosData(r) || []);
      isBusy.value = false;
    });
  } catch (error: any) {
    emit("fail", error);
    isBusy.value = false;
  }
};
</script>
