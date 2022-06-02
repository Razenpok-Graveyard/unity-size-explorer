import {computed, Ref, ref} from "vue";
import {BuildEntry} from "./BuildEntry";

export const isProcessing = ref(false);

export const logEntries: Ref<BuildEntry[]> = ref([]);

export const hasData = computed(() => logEntries.value.length > 0);

export const mergeSize = ref(0.01);

export const pieChartData = ref({
  labels: ["None"],
    datasets: [
    {
      backgroundColor: ["#000000"],
      data: [1]
    }
  ]
});

const pieChartColors = [
  "#008B8B",
  "#8A2BE2",
  "#A52A2A",
  "#D2691E",
  "#FF7F50",
  "#006400",
  "#483D8B",
  "#DAA520",
  "#4B0082",
  "#90EE90",
  "#EE82EE",
];

export function setPieChartData(labels: string[], data: number[]) {
  const count = labels.length;
  const colors = [];
  while (colors.length < count) {
    for (const color of pieChartColors) {
      colors.push(color);
      if (colors.length >= count) {
        break;
      }
    }
  }
  pieChartData.value = {
    labels: labels,
    datasets: [
      {
        backgroundColor: colors,
        data: data
      }
    ]
  }
}