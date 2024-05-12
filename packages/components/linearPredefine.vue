<script lang="ts" setup>
import { colorPredefine } from "../constants"
import { onChangeColorParams } from "../type"

const emit = defineEmits<(event: "change", value: onChangeColorParams) => void>()
const handleChange = (e: readonly [string, string]) => {
  emit("change", {
    gradient: [
      {
        color: e[0],
        left: 0,
      },
      {
        color: e[1],
        left: 100,
      },
    ],
    source: "linear",
  })
}
</script>

<template>
  <div class="color_predefine">
    <template v-for="(i, a) in colorPredefine.gradient" :key="a">
      <div class="color_box" :style="`background: linear-gradient(to right, ${i[0]}, ${i[1]})`" @click="handleChange(i)"></div>
    </template>
  </div>
</template>

<style scoped>
.color_predefine {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-row-gap: 7px;
  grid-column-gap: 6px;
  justify-items: center;
}

.color_predefine .color_box {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
  border-radius: 4px;
  cursor: pointer;
}

.color_predefine .color_box:hover {
  position: relative;
  transform: scale(1.3);
  z-index: 1;
}
</style>
