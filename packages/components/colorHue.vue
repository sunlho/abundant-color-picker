<script lang="ts" setup>
import { colorObj, colorType } from "../utils"
import { ref, watch } from "vue"

const props = defineProps<{
  color?: colorObj
}>()

const emit = defineEmits<{
  (event: "change", payload: colorType): void
  (
    event: "heart",
    payload: {
      type: 1
      color: string
    }
  ): void
}>()

const containerRef = ref<HTMLElement | null>(null)

const oldHue = ref(0)
const pullDirection = ref("")
const style = ref({
  left: "0%",
})

const changeOldHue = (e: number) => {
  if (e !== 0 && e - oldHue.value > 0) {
    pullDirection.value = "right"
  }
  if (e !== 0 && e - oldHue.value < 0) {
    pullDirection.value = "left"
  }
  oldHue.value = e
}

const handleChange = (e: MouseEvent | TouchEvent, t?: boolean) => {
  !t && e.preventDefault()
  if (!containerRef.value) return
  const n = containerRef.value.clientWidth
  const o = containerRef.value.getBoundingClientRect().left + window.pageXOffset
  const s = (e as MouseEvent).pageX || ((e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : 0)
  const l = s - o
  const a = l < 0 ? 0 : l > n ? 360 : (((100 * l) / n) * 360) / 100
  changeOldHue(a)
  style.value = {
    left: `${(100 * a) / 360}%`,
  }
  if (props.color?.hsl?.h !== a) {
    emit("change", {
      h: a,
      s: props.color?.hsl?.s || 0,
      l: props.color?.hsl?.l || 0,
      a: props.color?.hsl?.a || 0,
      source: "hsl",
    })
  }
}

const handleMouseDown = (e: MouseEvent) => {
  handleChange(e, true)
  window.addEventListener("mousemove", handleChange)
  window.addEventListener("mouseup", handleMouseUp)
}

const handleMouseUp = (e: MouseEvent) => {
  unbindEventListeners()
}

const unbindEventListeners = () => {
  window.removeEventListener("mousemove", handleChange)
  window.removeEventListener("mouseup", handleMouseUp)
}

watch(
  () => props.color,
  (e) => {
    changeOldHue(e?.hsl?.h || 0)
    if (e?.hsl?.h === 0 && pullDirection.value === "right") {
      style.value = {
        left: "100%",
      }
    } else {
      style.value = {
        left: `${(100 * Number(e?.hsl?.h)) / 360}%`,
      }
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="color_hue">
    <div ref="containerRef" class="item_hue" @mousedown="handleMouseDown" @touchmove="handleChange" @touchstart="handleChange">
      <div class="item_point" :style="{ left: style.left }">
        <div class="item_circle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color_hue {
  width: 100%;
  height: 14px;
  border-radius: 7px;
  padding: 0 8px;
  background-color: red;
  cursor: pointer;
}

.color_hue .item_hue {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
}

.color_hue .item_hue .item_point {
  cursor: e-resize;
  position: absolute;
  top: -1px;
}

.color_hue .item_hue .item_point .item_circle {
  width: 16px;
  height: 16px;
  border: 3px solid #fff;
  background: transparent;
  border-radius: 50%;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
  transform: translate(-8px);
}
</style>
