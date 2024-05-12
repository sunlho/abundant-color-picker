<script lang="ts" setup>
import { ref } from "vue"
import { AbundantColorPickerBox } from "../packages/index"
const color = ref<string>("#000000")
</script>

<template>
  <div style="display: flex; justify-content: center">
    <AbundantColorPickerBox v-model="color"></AbundantColorPickerBox>
  </div>
</template>

<style></style>
