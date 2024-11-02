<template>
  <v-card flat max-height="180">
    <p class="text-uppercase text-subtitle-2">
      {{ title }}
    </p>
    <div
      style="max-height: 150px"
      class="text-medium-emphasis text-subtitle-2 pt-2 limited-lines"
    >
      {{ text }}
    </div>
    <v-dialog max-width="500" v-if="readMore">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          size="small"
          :ripple="false"
          variant="plain"
          color="primary"
          class="pa-0 ma-0 text-none"
        >
          {{ $t("readMore") }}
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card :title="$t('projectDescription')">
          <v-card-text class="text-medium-emphasis text-subtitle-2 pt-2">
            {{ text }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :text="$t('close')" @click="isActive.value = false"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  text: string;
}>();

const maxText = 173;

const length = computed(() => {
  return props.text.length;
});

const readMore = computed((): boolean => {
  return length.value > maxText ? true : false;
});
</script>

<style scoped></style>
