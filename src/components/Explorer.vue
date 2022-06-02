<script setup lang="ts">
import LogTree from "./LogTree.vue";
import {Splitpanes, Pane} from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import DoughnutChart from "./DoughnutChart";
import {hasData} from "../store";
import {pieChartData} from "../store";
</script>

<template>
  <Splitpanes class="default-theme">
    <Pane>
      <LogTree v-if="hasData"/>
    </Pane>
    <Pane class="chart-pane" ref="chartPane">
      <DoughnutChart v-if="hasData" class="chart" :chart-data="pieChartData"/>
    </Pane>
  </Splitpanes>
</template>

<style scoped>
.chart-pane {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
