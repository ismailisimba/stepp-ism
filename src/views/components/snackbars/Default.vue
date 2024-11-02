<template>
  <v-snackbar v-model="showSnackbar" :timeout="timeout" :color="color">
    {{ message }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showSnackbar = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { SnackbarColor } from "@/types/types";
import { ref, watch } from "vue";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "DefaultSnackbar",
  props: {
    timeout: { type: Number },
    color: { type: String as PropType<SnackbarColor>, default: "primary" },
    show: { type: Boolean, default: false },
    message: { type: String, required: true },
  },

  setup(props, ctx) {
    const showSnackbar = ref(false);
    watch(
      () => props.show,
      (newValue) => {
        showSnackbar.value = newValue;
      }
    );
    return { showSnackbar };
  },
});
</script>
