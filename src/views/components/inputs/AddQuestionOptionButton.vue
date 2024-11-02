<template>
  <v-row>
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
      <v-btn color="primary" variant="text" @click="$emit('click')" class="text-none">{{
        t("addOption")
      }}</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const props = defineProps<{
  type : string
}>()

const { t } = useI18n();
const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped></style>
