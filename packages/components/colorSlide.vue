<script lang="ts" setup>
import { nextTick } from "vue"
import { ref, computed, onMounted, onUnmounted } from "vue"

const props = defineProps<{
  angle: string | number
}>()

const emit = defineEmits<{
  (event: "slide", value: string | number): void
}>()

const containerRef = ref<HTMLElement | null>(null)

const onFocus = ref(false)
const slide = ref(slideRender(`${props.angle}`))

const slideNum = computed(() => {
  return typeof slide.value === "string" && slide.value.indexOf("°") > -1 ? slide.value.replace("°", "") : slide.value
})

function handleChange(e: MouseEvent | TouchEvent, t?: boolean) {
  !t && e.preventDefault()
  if (!containerRef.value) return
  const n = containerRef.value.clientWidth
  const o = containerRef.value.getBoundingClientRect().left + window.pageXOffset
  const s = (e as MouseEvent).pageX || ((e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : 0)
  const l = s - o
  let a
  if (l < 0) {
    a = -360
  } else if (l > n) {
    a = 360
  } else {
    a = ((l / n) * 720 - 360).toFixed(0)
  }
  emit("slide", a)
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const t = target.dataset.min
  const i = target.dataset.max
  const a = target.dataset.len
  if ((i && Number(target.value) > parseInt(i)) || (t && Number(target.value) < parseInt(t)) || (a && target.value.length > parseInt(a))) {
    slide.value = slideRender(`${props.angle}`)
    return false
  }
  emit("slide", slide.value)
}

function slideRender(e: string) {
  return onFocus.value ? e.replace("°", "") : e + "°"
}

function inputBlurFocus(e: FocusEvent, t: "blur" | "focus") {
  onFocus.value = t === "focus"
  slide.value = slideRender(slide.value)
  if (t === "focus") {
    nextTick(() => {
      ;(e.currentTarget as HTMLInputElement).select()
    })
  }
}

function handleMouseDown(e: MouseEvent) {
  handleChange(e, true)
  window.addEventListener("mousemove", handleChange)
  window.addEventListener("mouseup", handleMouseUp)
}

function handleMouseUp(e: MouseEvent) {
  unbindEventListeners()
}

function unbindEventListeners() {
  window.removeEventListener("mousemove", handleChange)
  window.removeEventListener("mouseup", handleMouseUp)
}

onMounted(() => {
  slide.value = `${props.angle}`
})

onUnmounted(() => {
  unbindEventListeners()
})
</script>

<template>
  <template>
    <div class="color_slide">
      <div class="slide_desc">
        <div class="title">角度</div>
        <input
          v-model="slide"
          class="color_input"
          :class="{ focus: onFocus }"
          spellcheck="false"
          :data-min="-360"
          :data-max="360"
          type="text"
          @change="handleInput"
          @blur="inputBlurFocus($event, 'blur')"
          @focus="inputBlurFocus($event, 'focus')"
          @input="slide = ($event.target as HTMLInputElement).value"
        />
      </div>
      <div class="slide_line">
        <div class="slide_box">
          <div ref="containerRef" class="slide_warp" @mousedown="handleMouseDown" @touchmove="handleChange" @touchstart="handleChange">
            <div class="slide_bg"></div>
            <div class="slide_zero"></div>
            <div class="slide_point" :style="{ left: `${(100 * (360 + Number(slideNum))) / 720}%` }">
              <div class="slide_circle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
.color_slide .slide_desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color_slide .slide_desc .color_input {
  width: 28px;
  border: none;
  background-color: transparent;
  font-size: inherit;
  color: #666;
  text-align: center;
  padding: 2px 0;
}

.color_slide .slide_desc .color_input:focus {
  border-bottom: 1px solid var(--color-picker-color-primary);
}

.color_slide .slide_desc .color_input:focus::-moz-selection {
  color: var(--color-white);
  background: var(--color-picker-color-primary);
}

.color_slide .slide_desc .color_input:focus::selection {
  color: var(--color-white);
  background: var(--color-picker-color-primary);
}

.color_slide .slide_line {
  position: relative;
  margin: 0 7px;
}

.color_slide .slide_line:before {
  content: "";
  position: absolute;
  width: 7px;
  height: 2px;
  top: 6px;
  left: -7px;
  background-color: #e1e1e1;
}

.color_slide .slide_line:after {
  content: "";
  position: absolute;
  width: 7px;
  height: 2px;
  top: 6px;
  right: -7px;
  background-color: #e1e1e1;
}

.color_slide .slide_line .slide_box {
  line-height: normal;
  margin: 0 auto;
}

.color_slide .slide_line .slide_box .slide_warp {
  width: 100%;
  height: 2px;
  margin: 8px 0;
  padding: 6px 0;
  border-radius: 3px;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
}

.color_slide .slide_line .slide_box .slide_bg {
  height: 2px;
  border-radius: 3px;
  background-color: #e1e1e1;
}

.color_slide .slide_line .slide_box .slide_zero {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 14px;
  background-color: #dddee1;
  transform: translateY(-50%);
}

.color_slide .slide_line .slide_box .slide_point {
  cursor: pointer;
  position: absolute;
  top: 0;
  z-index: 1;
}

.color_slide .slide_line .slide_box .slide_point .slide_circle {
  width: 16px;
  height: 16px;
  border: 3px solid #707070;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
  transform: translate(-8px);
}
</style>
