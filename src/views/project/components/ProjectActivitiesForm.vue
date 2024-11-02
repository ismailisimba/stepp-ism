<template>
  <v-container fluid>
    <v-card v-if="!hasActivities" flat min-height="250px">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-center">
          <v-btn
            rounded="pill"
            size="large"
            class="text-none mt-16"
            prepend-icon="mdi-plus-circle"
            color="primary"
            @click="addActivity"
          >
            {{ t("addActivity") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-sheet v-else>
      <v-row justify="end">
        <v-col cols="auto">
          <PageHeaderBtn
            class="mb-4 pull-right"
            :text="t('addActivity')"
            icon="mdi-plus-circle"
            color="primary"
            @click="addActivity"
          />
        </v-col>
      </v-row>

      <v-data-table
        v-model:expanded="expanded"
        :headers="activityHeaders"
        :items="activities"
        item-value="name"
        density="compact"
        hide-default-footer
      >
        <!-- show-expand -->
        <!-- Start date Column -->
        <template v-slot:item.startDate="{ value }">
          {{ formatAsShortDate(value) }}
        </template>

        <!-- End date Column -->
        <template v-slot:item.endDate="{ value }">
          {{ formatAsShortDate(value) }}
        </template>

        <!-- Action -->
        <template v-slot:item.actions="{ index, item, isExpanded }">
          <v-icon
            color="primary"
            class="me-2"
            size="x-large"
            icon="mdi-file-edit-outline"
            @click.prevent="updateActivity(index)"
          >
          </v-icon>
          <v-icon
            :color="expanded.includes(item.name) ? 'success' : 'primary'"
            class="me-2"
            size="x-large"
            :icon="expanded.includes(item.name) ? 'mdi-eye' : 'mdi-eye-outline'"
            @click="expand(item.name)"
          >
          </v-icon>
          <v-icon
            color="primary"
            class="me-2"
            size="x-large"
            icon="mdi-close"
            @click="deleteActivity(index)"
          >
          </v-icon>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <p class="text-subtitle text-uppercase text-disabled py-2">
                {{ t("description") }}
              </p>
              <p class="pb-4">
                {{ item.description }}
              </p>
            </td>
          </tr>
          <tr>
            <td :colspan="columns.length">
              <p class="text-subtitle text-uppercase text-disabled py-2">
                {{ t("associatedResults") }}
              </p>
              <p class="pb-4">
                {{ item.associatedResults }}
              </p>
            </td>
          </tr>
          <tr>
            <td :colspan="columns.length">
              <p class="text-subtitle text-uppercase text-disabled py-2">
                {{ t("associatedOutcomes") }}
              </p>
              <p class="pb-4">
                {{ item.associatedOutcomes }}
              </p>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>

  <ActivityModalForm
    :show="showActivityModalForm"
    :activity="activity || null"
    :min-date="minDate"
    :max-date="maxDate"
    @success="updateActivitiesList"
    @close="showActivityModalForm = false"
  />
</template>

<script setup lang="ts">
import { formatAsShortDate } from "@/helpers/dateFormats";
import { isNumeric } from "@/helpers/general";
import { Activities, Activity } from "@/models/Activity";
import ActivityModalForm from "@/views/activity/ActivityModalForm.vue";
import PageHeaderBtn from "@/views/components/buttons/PageHeaderBtn.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  activities: Activities | null;
  minDate: Date;
  maxDate: Date;
}>();

//Variables
const { t } = useI18n();
const showActivityModalForm = ref<boolean>(false);
const activity = ref<Activity | null>();
const updateIndex = ref<number | null>();
const expanded = ref<Array<string>>([]);
const activityHeaders = [
  { title: t("name"), key: "name", width: "55%", sortable: false  },
  { title: t("startDate"), key: "startDate", width: "15%", sortable: false },
  { title: t("endDate"), key: "endDate", width: "15%", sortable: false },
  { title: t("actions"), key: "actions", width: "15%", sortable: false },
];

//Methods
const expand = (name: string) => {
  const index = expanded.value.findIndex((i) => i === name);
  if (index > -1) {
    expanded.value.splice(index, 1);
  } else {
    expanded.value.push(name);
  }
};

const deleteActivity = (index: number) => {
  emit("delete", index);
};

const updateActivitiesList = (activity: Activity) => {
  emit(
    "success",
    activity,
    isNumeric(updateIndex.value) ? (updateIndex.value as number) : null
  );
};

const addActivity = () => {
  activity.value = null;
  updateIndex.value = null;
  showActivityModalForm.value = true;
};

const hasActivities = computed(() => {
  if (props.activities) if (props.activities.length > 0) return true;
  return false;
});

const updateActivity = (index: number) => {
  if (props.activities) {
    updateIndex.value = index;
    activity.value = props.activities[index];
    showActivityModalForm.value = true;
  }
};

const emit = defineEmits<{
  (e: "delete", index: number): void;
  (e: "success", activity: Activity, index: number | null): void;
  (e: "fail", payload: { error: any }): void;
}>();
</script>

<style scoped></style>
