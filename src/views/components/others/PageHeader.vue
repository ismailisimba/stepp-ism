<template>
  <p class="text-h5 font-weight-regular text-pageHeading">
    {{ text }}
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>

<style scoped></style>
