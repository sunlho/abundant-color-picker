<script lang="ts" setup>
import { colorObj, colorType } from "../utils"
import { reactive, onMounted, onUnmounted, computed, toRefs, ref } from "vue"

const props = defineProps<{
  color?: colorObj
}>()

const containerRef = ref<HTMLElement | null>(null)

const style = reactive({
  top: "0%",
  left: "0%",
})

const bgColor = computed(() => {
  return `hsl(${props.color?.hsv?.h}, 100%, 50%)`
})

const emit = defineEmits<{
  (event: "change", payload: colorType): void
}>()

const clamp = (e: any, t: any, i: any) => {
  return t < i ? (e < t ? t : e > i ? i : e) : e < i ? i : e > t ? t : e
}

const handleChange = (e: MouseEvent | TouchEvent, t?: boolean) => {
  !t && e.preventDefault()
  if (!containerRef.value) return
  const a = containerRef.value.clientWidth
  const n = containerRef.value.clientHeight
  const o = containerRef.value.getBoundingClientRect().left + window.scrollX
  const s = containerRef.value.getBoundingClientRect().top + window.scrollY
  const l = (e as MouseEvent).pageX || ((e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : 0)
  const r = (e as MouseEvent).pageY || ((e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageY : 0)
  const d = clamp(l - o, 0, a)
  const c = clamp(r - s, 0, n)
  const g = d / a
  const p = clamp(1 - c / n, 0, 1)
  style.top = `${100 * (1 - p)}%`
  style.left = `${100 * g}%`
  emit("change", {
    h: props.color?.hsv?.h || 0,
    s: g,
    v: p,
    a: props.color?.hsv?.a || 0,
    source: "hsva",
  })
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
  style.top = `${100 * (1 - Number(props.color?.hsv?.v))}%`
  style.left = `${100 * Number(props.color?.hsv?.s)}%`
})

onUnmounted(() => {
  unbindEventListeners()
})
</script>

<template>
  <div class="color_saturation">
    <div
      ref="containerRef"
      class="item_saturation"
      :style="{ background: bgColor }"
      @mousedown="handleMouseDown"
      @touchmove="handleChange"
      @touchstart="handleChange"
    >
      <div class="item_white"></div>
      <div class="item_black"></div>
      <div class="item_point" :style="{ top: style.top, left: style.left }">
        <div class="item_circle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color_saturation {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
}

.color_saturation .item_black,
.color_saturation .item_saturation,
.color_saturation .item_white {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
}

.color_saturation .item_white {
  background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
}

.color_saturation .item_black {
  background: linear-gradient(0deg, #000, transparent);
}

.color_saturation .item_point {
  cursor: pointer;
  position: absolute;
}

.color_saturation .item_point .item_circle {
  width: 8px;
  height: 8px;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3), 0 0 1px 2px rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  transform: translate(-4px, -4px);
}
</style>
