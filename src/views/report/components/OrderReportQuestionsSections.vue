<template>
  <v-dialog v-model="showDialog" @click:outside="close()" max-width="550">
    <template v-slot:default="{ isActive }">
      <v-card :title="title">
        <v-card-text>
          <v-divider></v-divider>
          <draggable
            v-model="orderable"
            :animation="200"
            :component-data="{ name: 'fade' }"
            item-key="id"
          >
            <template #item="{ element: section, index }">
              <v-sheet class="cursor-move">
                <v-list-item>
                  <template v-slot:prepend="{ isActive }">
                    <v-list-item-action start>
                      <v-icon class="move" icon="mdi-dots-grid"></v-icon>
                    </v-list-item-action>
                  </template>
                  <v-list-item-title>
                    {{
                      section.title
                        ? section.title
                        : `${t("section")} ${index + 1}`
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ t("section") }} {{ index + 1 }} {{ t("of") }}
                    {{ orderable.length }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
              </v-sheet>
            </template>
          </draggable>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="isSaving"
            :text="$t('cancel')"
            @click="close"
          ></v-btn>
          <v-btn
            variant="flat"
            :disabled="isSaving"
            :loading="isSaving"
            color="primary"
            :text="$t('save')"
            @click="save"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import { ReportSectionQuestions } from "@/models/ReportSectionQuestion";
import { computed } from "vue";

const { t } = useI18n();

const props = defineProps<{
  modelValue: ReportSectionQuestions;
  show: boolean;
}>();

const showDialog = ref(false);
const orderable = ref();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "succeed", payload: { res: any }): void;
  (e: "update:modelValue", payload: any): void;
}>();

const title = t("reorderSections");
const isSaving = ref(false);

const close = () => {
  emit("close");
};

const updateValue = (value: any) => {
  emit("update:modelValue", value);
};
const sections = computed(() => {
  if (props.modelValue) orderable.value = props.modelValue;
});

watch(
  () => props.show,
  (newValue) => {
    isSaving.value = false;
    showDialog.value = newValue;
  }
);

watch(
  () => sections.value,
  (newValue) => {
    orderable.value = newValue;
  }
);

const save = async () => {
  updateValue(orderable.value);
  close();
};
</script>
