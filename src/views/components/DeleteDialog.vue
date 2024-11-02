<template>
  <v-dialog v-model="showDialog"  @click:outside="close()" max-width="500px">
    <v-card class="pt-3">
      <v-card-title class="text-h5">{{
        title ? title : $t("deleteItemMessage")
      }}</v-card-title>
      <v-card-subtitle v-if="itemName">
        {{ itemName }}
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="isDeleting"
          color="blue-darken-1"
          variant="text"
          @click="close"
          >{{ btnCancelText ?? t("cancel") }}</v-btn
        >
        <v-btn
          :disabled="isDeleting"
          :loading="isDeleting"
          color="primary"
          variant="tonal"
          @click="deleteItem"
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
const { t } = useI18n();

const props = defineProps<{
  title?: string;
  show: boolean;
  itemName?: string;
  itemId: string;
  deleteUrl: string;
  btnCancelText?: string;
  btnOkText?: string;
}>();

const showDialog = ref(false);

// Define emits
const emit = defineEmits<{
  (e: "close"): void;
  (e: "deleted", payload: { res: any }): void;
  (e: "failed", payload: { error: any }): void;
}>();

const close = () => {
  emit("close");
};

const isDeleting = ref(false);

const deleteItem = async () => {
  isDeleting.value = true;
  try {
    await axios.post(props.deleteUrl, getPayload()).then((r) => {
      if (r.status != 200) {
        //emit("failed", (r.status as any));
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      extractAxiosData(r) || [];

      emit("deleted", extractAxiosData(r) || []);
    });
  } catch (error: any) {
    emit("failed", error);
  }
};

const getPayload = () => {
  let payload = new FormData();
  payload.append("id_type", "STRING");
  payload.append("id", props.itemId);
  return payload;
};

watch(
  () => props.show,
  (newValue) => {
    isDeleting.value = false;
    showDialog.value = newValue;
  }
);
</script>
