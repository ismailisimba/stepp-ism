<template>
  <v-container fluid v-if="solGraphData || fundGraphData">
    <v-row>
      <v-col v-if="solGraphData" cols="12" sm="12" md="6">
        <v-card :subtitle="t('programVsSolicitationCount')">
          <v-card-text>
            <Bar :data="solGraphData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="fundGraphData" cols="12" sm="12" md="6">
        <v-card :subtitle="t('programVsTotalFunding')">
          <v-card-text>
            <Bar :data="fundGraphData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { programGraphsData } from "@/services/graph_service";
import { computed, onMounted, ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { colors } from "@/constants/app_constants";
import { useI18n } from "vue-i18n";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
const isGettingData = ref<boolean>(false);
const data = ref<any>();
const { t } = useI18n();
const chartOptions = {
  plugins: {
    legend: {
      display: false, // Hides the legend
    },
    tooltip: {
      enabled: true, // Disables tooltips
    },
  },
};

const solGraphData = computed(() => {
  if (data.value)
    if (data.value.programSolicitations) {
      const labels = [...(data.value.programSolicitations.x || [])];
      const datasets = [
        {
          label: "",
          backgroundColor: colors.default,
          data: [...(data.value.programSolicitations.y || [])],
        },
      ];
      return { labels: labels, datasets: datasets };
    }
  return null;
});

const fundGraphData = computed(() => {
  if (data.value)
    if (data.value.programFunding) {
      const labels = [...(data.value.programFunding.x || [])];
      const datasets = [
        {
          label: "",
          backgroundColor: colors.default,
          data: [...(data.value.programFunding.y || [])],
        },
      ];
      return { labels: labels, datasets: datasets };
    }
  return null;
});

const getData = async () => {
  try {
    isGettingData.value = true;
    await programGraphsData().then((r) => {
      data.value = r;
      isGettingData.value = false;
    });
  } catch (error) {
    isGettingData.value = false;
    throw error;
  }
};

onMounted(async () => {
  await getData();
});
</script>

<style scoped></style>
