<template>
  <v-btn
    :variant="variant"
    @click="emit('click')"
    class="mr-3"
    rounded
    :color="color"
    size="small"
  >
    <v-icon
      size="24"
      style="left: -11px"
      class="ml-0 mr-0"
      :icon="icon"
      start
    ></v-icon>
    <span style="margin-left: -5px"> {{ text }} </span>
  </v-btn>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color: string;
    icon: string;
    text: string;
    variant?: string;
  }>(),
  {
    variant: "flat",
  }
);

// Define emits
const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped></style>
