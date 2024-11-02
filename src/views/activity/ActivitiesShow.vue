<template>
  <div>
    <v-card
      rounded="lg"
      variant="tonal"
      v-for="activity in activities"
      class="my-5"
    >
      <v-card-title>
        {{ formatAsShortDate(activity.startDate) }} -
        {{ formatAsShortDate(activity.endDate) }}
      </v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <v-card-subtitle class="pa-0 text-subtitle-1">
              {{ $t("activityName") }}
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" class="pb-3">
            <p>{{ activity.name }}</p>
          </v-col>
          
          <v-col cols="12">
            <v-card-subtitle class="pa-0 text-subtitle-1">
              {{ $t("description") }}
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" class="pb-3">
            <p>{{ activity.description }}</p>
          </v-col>
          
          <v-col cols="12"  v-if="activity.outcomes">
            <v-card-subtitle class="pa-0 text-subtitle-1">
              {{ $t("associatedOutcomes") }}
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" v-if="activity.outcomes" class="pb-3">
            <p>{{ activity.outcomes }}</p>
          </v-col>

          <v-col cols="12" v-if="activity.results">
            <v-card-subtitle class="pa-0 text-subtitle-1">
              {{ $t("associatedResults") }}
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" v-if="activity.results">
            <p>{{ activity.results }}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { formatAsShortDate } from "@/helpers/dateFormats";
import { Activities } from "@/models/Activity";

const props = defineProps<{
  activities: Activities;
}>();
</script>

<style scoped></style>
