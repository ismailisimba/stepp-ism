<template>
  <Doughnut :data="chartData" />
</template>

<script>
import { Doughnut} from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { toRefs } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "CountChart",
  components: { Doughnut },
  props: {
    chartData: {
      type: Object,
    },
  },
  setup(props) {
    const { chartData } = toRefs(props);
    return { chartData };
  },
};
</script>
