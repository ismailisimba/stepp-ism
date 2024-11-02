<template>
  <v-tooltip
    bottom
    @update:modelValue="updated"
    :close-delay="3"
    :opacity="0.9"
    :model-value="show"
    :close-on-content-click="true"
    :open-on-click="false"
    :open-on-hover="false"
    :text="t('copiedToClip')"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        flat
        variant="plain"
        @click="copyToClipboard"
        icon="mdi-content-copy"
        col
        class="ml-3"
        size="x-small"
      ></v-btn>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { isArray } from "@/helpers/general";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  val: any;
}>();

const { t } = useI18n();
const show = ref<boolean>();
const time = 1000;

const updated = () => {};

const copyToClipboard = () => {
  const t = isArray(props.val) ? (props.val as Array<any>).join() : props.val;
  navigator.clipboard
    .writeText(t as string)
    .then(() => {
      show.value = true;

      setTimeout(() => {
        show.value = false;
      }, time);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};
</script>

<style scoped></style>
