<script setup lang="ts">
import Explorer from './components/Explorer.vue'
import FileDrop from "./components/FileDrop.vue";
</script>

<template>
  <FileDrop class="app__file-drop"/>
  <Explorer class="app__explorer"/>
</template>

<style>
html {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/*noinspection CssUnusedSymbol*/
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app__file-drop {
  flex: 1 0 auto;
}

.app__explorer {
  flex: 1 0 auto;
  height: 90%;
}
</style>
