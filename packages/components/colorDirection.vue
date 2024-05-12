<script lang="ts" setup>
import { colorToObj } from "../utils"
import { computed, watch } from "vue"
import { ref, reactive, onMounted } from "vue"

const props = defineProps<{
  color: Array<{ left: number; color: string }>
  direction: string | number
  directionList: Array<string>
}>()

const emit = defineEmits<{
  (event: "direction", direction: string | number): void
}>()

const directionPicker = ref<HTMLElement | null>(null)

const directionIndex = ref(props.direction)
const showOption = ref(false)

const bgColor = computed(() => {
  let result = ""
  props.color.forEach((item) => {
    let rgba = colorToObj(item.color).rgba || { r: 0, g: 0, b: 0, a: 1 }
    result += `,rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a}) ${item.left}%`
  })
  return result
})

const handleDirection = (direction: number | string) => {
  emit("direction", direction)
}

onMounted(() => {
  document.addEventListener("click", (event) => {
    if (directionPicker.value && !directionPicker.value.contains(event.target as HTMLElement)) {
      showOption.value = false
    }
  })
})

watch(
  () => props.direction,
  (newDirection) => {
    directionIndex.value = newDirection
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="color_direction">
    <div class="direction_select">
      <div class="label">方向</div>
      <div ref="directionPicker" class="direction_right">
        <div class="direction_selector" @click="showOption = !showOption">
          <div
            class="color_box"
            :style="{ background: `radial-gradient(farthest-side at ${directionList[Number(direction)]} ${bgColor})` }"
          ></div>
        </div>
      </div>
    </div>
    <div class="direction_options">
      <div v-show="showOption" class="direction_options_box">
        <div
          v-for="(item, index) in directionList"
          :key="index"
          class="item_option"
          :style="{ background: `radial-gradient(farthest-side at ${directionList[index]} ${bgColor})` }"
          @click="handleDirection(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color_direction {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.color_direction .direction_select {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color_direction .label {
  font-size: 12px;
}

.color_direction .direction_selector {
  width: 38px;
  height: 29px;
  border-bottom: 1px solid #c1c1c1;
  cursor: pointer;
}

.color_direction .direction_selector .color_box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  position: relative;
}

.color_direction .direction_selector .color_box:after {
  content: "";
  width: 0;
  height: 0;
  border: 3px solid transparent;
  border-top-color: #b7b7b7;
  position: absolute;
  top: 50%;
  left: 32px;
  transform: translateY(-50%);
}

.color_direction .direction_selector:hover {
  border-color: var(--color-picker-color-primary);
}

.color_direction .direction_selector:hover .color_box:after {
  border-top-color: var(--color-picker-color-primary);
}

.color_direction .direction_options {
  display: flex;
  justify-content: flex-end;
}
.color_direction .direction_options .direction_options_box {
  width: 104px;
  height: 104px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 6px;
  grid-column-gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
  z-index: 10;
}
.color_direction .direction_options .direction_options_box .item_option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}
</style>
