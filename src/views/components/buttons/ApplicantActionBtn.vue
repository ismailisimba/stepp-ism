<template>
  <v-btn
    variant="outlined"
    class="text-none mx-1"
    @click="emit('click')"
    rounded="pill"
    size="small"
    :color="color"
    :text="text"
  >
  </v-btn>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?: string;
    text: string;
  }>(),
  {
    color: "primary",
  }
);

// Define emits
const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped></style>
