<template>
  <v-dialog v-model="showDialog" max-width="800" @click:outside="close()">
    <v-card class="pt-3">
      <v-card-title class="text-h5">{{ $t("awardApp") }}</v-card-title>
      <v-card-text>
        <v-data-table-server
          mobile-breakpoint="sm"
          :headers="headers"
          :items="applications"
          :items-length="applications?.length || 0"
          :loading="isgettingApps"
          loading-text="loadingApps"
          :hide-default-footer="true"
          show-select
          v-model="selected"
        >
        </v-data-table-server>
      </v-card-text>

      <v-card-actions class="text-right">
        <v-spacer></v-spacer>
        <v-btn
          :disabled="isSubmitting"
          color="blue-darken-1"
          variant="text"
          @click="close"
          >{{ t("cancel") }}</v-btn
        >
        <v-btn
          :disabled="isSubmitting || selected.length == 0"
          :loading="isSubmitting"
          variant="flat"
          color="primary"
          @click="submit"
          >{{ t("submit") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { search } from "@/services/search_service";
import { SearchFieldData } from "@/types/types";
import { Applications } from "@/models/Application";
import { award, shortlist } from "@/services/solicitation_service";
const { t } = useI18n();

const props = defineProps<{
  show: boolean;
  solId: string;
}>();

const showDialog = ref(false);
const isgettingApps = ref(false);
const applications = ref<Applications>();
const selected = ref([]);
const isSubmitting = ref(false);
const headers = [
  {
    title: t("applicationName"),
    key: "name",
    sortable: false,
    width: "60%",
  },
  {
    title: t("rank"),
    key: "rank",
    sortable: false,
    width: "20%",
  },
  { title: t("email"), key: "contactEmail", sortable: false, width: "20%" },
];

// Define emits
const emit = defineEmits<{
  (e: "close"): void;
  (e: "success", payload: { res: any }): void;
  (e: "failed", payload: { error: any }): void;
}>();

const close = () => {
  emit("close");
};

const submit = async () => {
  isSubmitting.value = true;
  try {
    await award(selected.value).then((r) => {
      emit("success", r);
      isSubmitting.value = false;
    });
  } catch (error: any) {
    isSubmitting.value = false;
    emit("failed", error);
  }
};

const getApplications = async () => {
  isgettingApps.value = true;
  try {
    await search(searchPayload()).then((r) => {
      applications.value = r;
      isgettingApps.value = false;
    });
  } catch (error) {
    isgettingApps.value = false;
  }
};

const searchPayload = () => {
  let p: SearchFieldData;
  p = {
    basicSearch: "",
    tableId: "application",
    orderType: "ascending",
    advanceSearchValues: [
      {
        name: "status",
        value: "in_shortlist",
        checked: true,
      },
      {
        name: "solicitation_id",
        value: props.solId,
        checked: true,
      },
    ],
  };
  return p;
};

onMounted(async () => {
  await getApplications();
});

watch(
  () => props.show,
  (newValue) => {
    showDialog.value = newValue;
  }
);
</script>
