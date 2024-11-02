<template>
  <v-container fluid v-if="firstGraphData || secGraphData">
    <v-row>
      <v-col v-if="firstGraphData" cols="12" sm="12" md="6">
        <v-card :subtitle="t('yearVsAppCount')">
          <v-card-text>
            <Bar :data="firstGraphData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="secGraphData" cols="12" sm="12" md="6">
        <v-card :subtitle="t('yearVsAppSuccessRate')">
          <v-card-text>
            <Line :data="secGraphData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
} from "chart.js";
import { colors } from "@/constants/app_constants";
import { useI18n } from "vue-i18n";
import { solicitationGraphsData } from "@/services/graph_service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
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

const firstGraphData = computed(() => {
  if (data.value)
    if (data.value.applicationReceivedCountPerYear) {
      const labels =
        Object.keys(data.value.applicationReceivedCountPerYear) || [];
      const datasets = [
        {
          label: "",
          backgroundColor: colors.default,
          data: Object.values(data.value.applicationReceivedCountPerYear) || [],
        },
      ];
      return { labels: labels, datasets: datasets };
    }
  return null;
});

const secGraphData = computed(() => {
  if (data.value)
    if (data.value.applicationSuccessRatePerYear) {
      const labels =
        Object.keys(data.value.applicationSuccessRatePerYear) || [];
      const datasets = [
        {
          label: "",
          backgroundColor: colors.default,
          data: Object.values(data.value.applicationSuccessRatePerYear) || [],
        },
      ];
      return { labels: labels, datasets: datasets };
    }
  return null;
});

const getData = async () => {
  try {
    isGettingData.value = true;
    await solicitationGraphsData().then((r) => {
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
