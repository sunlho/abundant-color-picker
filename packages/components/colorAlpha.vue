<script lang="ts" setup>
import { colorObj, colorType } from "../utils"
import { ref, onMounted, onUnmounted, computed, toRef } from "vue"

const props = defineProps<{
  color?: colorObj
}>()
const containerRef = ref<HTMLElement | null>(null)

const colors = toRef(props, "color")

const emit = defineEmits<{
  (event: "change", value: colorType): void
}>()

const solidColor = computed(() => {
  const e = colors.value?.rgba || { r: 0, g: 0, b: 0, a: 1 }
  const t = [e.r, e.g, e.b].join(",")
  return `linear-gradient(to right, rgba(${t}, 0) 0%, rgba(${t}, 1) 100%)`
})

const handleChange = (e: TouchEvent | MouseEvent, t?: boolean) => {
  !t && e.preventDefault()
  if (!containerRef.value) return
  const n = containerRef.value.clientWidth
  const o = containerRef.value.getBoundingClientRect().left + window.scrollX
  const s = (e as MouseEvent).pageX || ((e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : 0)
  const l = s - o
  const a = l < 0 ? 0 : l > n ? 1 : Math.round((100 * l) / n) / 100
  if (colors.value?.a !== a) {
    emit("change", {
      h: colors.value?.hsl?.h || 0,
      s: colors.value?.hsl?.s || 0,
      l: colors.value?.hsl?.l || 0,
      a: a,
      source: "rgba",
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

onMounted(() => {
  containerRef.value?.addEventListener("mousedown", handleMouseDown)
})

onUnmounted(() => {
  unbindEventListeners()
})
</script>

<template>
  <div class="color_alpha">
    <div class="box_alpha" :style="{ background: solidColor }">
      <div
        class="item_alpha"
        ref="containerRef"
        @mousedown="handleMouseDown"
        @touchmove="(e) => handleChange(e)"
        @touchstart="(e) => handleChange(e)"
      >
        <div class="item_point" :style="{ left: 100 * Number(colors?.a) + '%' }">
          <div class="item_circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color_alpha {
  width: 100%;
  height: 14px;
  border-radius: 7px;
  cursor: pointer;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jfPbs2X8GPEBSUhKfNAPjqAHDIgz+//+PNx08f/4cfzoYNYCBceiHAQC5flV5JzgrxQAAAABJRU5ErkJggg==);
}

.color_alpha .box_alpha {
  width: 100%;
  height: 100%;
  padding: 0 8px;
  border-radius: 7px;
}

.color_alpha .box_alpha .item_alpha {
  position: relative;
  width: 100%;
  height: 100%;
}

.color_alpha .box_alpha .item_alpha .item_point {
  cursor: e-resize;
  position: absolute;
  top: -1px;
}

.color_alpha .box_alpha .item_alpha .item_point .item_circle {
  width: 16px;
  height: 16px;
  border: 3px solid #fff;
  background: transparent;
  border-radius: 50%;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
  transform: translate(-8px);
}
</style>
