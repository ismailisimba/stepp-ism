<template>
  <Bar :data="chartData" />
</template>

<script>
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
import { ref, toRefs } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "StatusChart",
  components: { Bar },
  props: {
    chartData: {
      type: Object,
    },
  },
  setup(props) {
    const { chartData } = toRefs(props);
    return { chartData };
  }
};
</script>
