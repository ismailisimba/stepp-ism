<template>
  <v-row class="pa-0 ma-0">
    <v-col cols="1" class="d-flex align-center justify-end text-right">
      <v-icon color="grey-lighten-1" size="x-large">
        {{
          type == "multiple-choice"
            ? "mdi-checkbox-blank-outline"
            : "mdi-checkbox-blank-circle-outline"
        }}
      </v-icon>
    </v-col>
    <v-col cols="9">
      <v-text-field
        variant="underlined"
        :model-value="modelValue"
        @update:model-value="updateModelValue($event)"
        :error-messages="errorMessage"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-btn v-if="total > 1" size="large" icon variant="text" @click="emit('remove')">
        <v-icon size="large">mdi-close</v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ t("remove") }}
        </v-tooltip>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
  type: string;
  total: number,
  errorMessage?: any
}>();

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "update:modelValue", payload: {}): void;
}>();

const updateModelValue = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<style scoped></style>
