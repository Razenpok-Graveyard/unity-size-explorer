<template>
  <div class="drop-area" @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <div class="fit-parent progress-container">
      <span class="progress-label">{{progressBarLabel}}</span>
    </div>
    <div v-show="showHint" class="fit-parent drop-hint" />
    <input v-if="!isProcessing" class="fit-parent drop-input" type="file" @change="onChange" ref="fileInput"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {isProcessing} from "../store";
import {readEditorLogFile} from "../store/read-editor-log-file";

const fileInput = ref(null);

const progressBarLabel = computed(() => isProcessing.value
    ? `Processing...`
    : "Drop a Unity Editor log file to analyze (or click here to select)"
);

const showHint = ref(false);

function onChange() {
  if (fileInput.value != null) {
    const input = fileInput.value as any;
    readEditorLogFile(input.files[0]);
  }
}

function dragover(event: DragEvent) {
  event.preventDefault();

  if (isProcessing.value) {
    return
  }

  showHint.value = true;
}

function dragleave() {
  if (isProcessing.value) {
    return
  }

  showHint.value = false;
}

function drop(event: DragEvent) {
  event.preventDefault();

  if (isProcessing.value) {
    return
  }

  showHint.value = false;
  if (event.dataTransfer !== null) {
    readEditorLogFile(event.dataTransfer.files[0]);
  }
}

</script>

<style scoped>
.drop-area {
  width: 100%;
  position: relative;
}

.fit-parent {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.drop-input {
  opacity: 0;
}

.drop-hint {
  background-color: dimgray;
}

.progress-container {
  background-color: gray;
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  pointer-events: none;
}

.progress-label {
  font-size: 25px;
  font-weight: bold;
  color: #f0f0f0;
  margin: auto;
  z-index: 1;
}

.progress-bar {
  background-color: green;
}
</style>