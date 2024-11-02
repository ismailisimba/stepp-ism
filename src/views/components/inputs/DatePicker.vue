<template>
  <v-menu
    v-model="menu"
    :close-on-click="true"
    :close-on-content-click="false"
    :close-on-esc="true"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        prepend-inner-icon="mdi-calendar-range"
        v-model="formattedDate"
        :density="density"
        @blur="$emit('blur')"
        @input="$emit('input')"
        :error="hasError"
        :error-messages="errorMessages"
        :label="label"
        aria-autocomplete="none"
        v-bind="props"
        readonly
        required
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="selectedDate"
      @update:model-value="closeMenu"
    ></v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
import { datePickerFormat } from "@/helpers/dateFormats";
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    density?: any;
    modelValue: Date | null;
    hasError?: boolean;
    errorMessages: any;
  }>(),
  {
    density: "default",
    hasError: false,
  }
);

const emit = defineEmits(["update:modelValue", "blur", "input"]);

const menu = ref(false);
const selectedDate = ref(props.modelValue);

const closeMenu = () => {
  menu.value = false;
};

watch(selectedDate, (newDate) => {
  emit("update:modelValue", newDate);
});

watch(
  () => props.modelValue,
  (newModelValue) => {
    selectedDate.value = newModelValue;
  },
  { immediate: true }
);
const formattedDate = computed(() => {
  return selectedDate.value ? datePickerFormat(selectedDate.value) : "";
});
</script>
