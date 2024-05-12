<script lang="ts" setup>
import { onHeartAddColor } from "../type"
import { colorObj, colorType } from "../utils"
import { onMounted, ref, watch } from "vue"

const props = defineProps<{
  color?: colorObj
}>()

const emit = defineEmits<{
  (event: "change", payload: colorType): void
  (event: "heart", payload: onHeartAddColor): void
}>()

const bgColor = ref("")
const hex = ref<string>()
const rgbR = ref("")
const rgbG = ref("")
const rgbB = ref("")
const rgbA = ref("")
const hexFocus = ref(false)
const rgbRFocus = ref(false)
const rgbGFocus = ref(false)
const rgbBFocus = ref(false)
const rgbAFocus = ref(false)

const initColor = (color?: colorObj) => {
  const rgba = color?.rgba || { r: 0, g: 0, b: 0, a: 1 }
  bgColor.value = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
  hex.value = color?.hex?.replace("#", "")
  rgbR.value = `${rgba.r}`
  rgbG.value = `${rgba.g}`
  rgbB.value = `${rgba.b}`
  rgbA.value = `${rgba.a}`
}

watch(
  () => props.color,
  (newColor) => {
    initColor(newColor)
  },
  {
    immediate: true,
  }
)

onMounted(() => {
  initColor(props.color)
})

const handleHeart = () => {
  emit("heart", {
    type: "add",
    color: bgColor.value,
  })
}

const isValidHex = (value?: string) => {
  return !!value && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
}

const inputBlurFocus = (event: FocusEvent, focus: "blur" | "focus", prop: "hex" | "rgbR" | "rgbG" | "rgbB" | "rgbA") => {
  if (focus === "focus") {
    ;(event.currentTarget as HTMLInputElement).select()
  }
  switch (prop) {
    case "hex":
      hexFocus.value = focus === "focus"
      break
    case "rgbR":
      rgbRFocus.value = focus === "focus"
      break
    case "rgbG":
      rgbGFocus.value = focus === "focus"
      break
    case "rgbB":
      rgbBFocus.value = focus === "focus"
      break
    case "rgbA":
      rgbAFocus.value = focus === "focus"
      break
  }
}

const handleInput = (event: Event, prop: "hex" | "rgb") => {
  const target = event.target as HTMLInputElement
  const min = target.dataset.min
  const max = target.dataset.max
  const len = target.dataset.len
  if (
    (typeof max !== "undefined" && Number(target.value) > parseInt(max)) ||
    (typeof min !== "undefined" && Number(target.value) < parseInt(min)) ||
    (typeof len !== "undefined" && target.value.length > parseInt(len))
  ) {
    return initColor(props.color)
  }

  if (prop === "hex") {
    if (isValidHex(`#${hex.value}`)) {
      emit("change", {
        hex: `#${hex.value}` || "",
        source: "hex",
      })
    }
  } else {
    emit("change", {
      r: typeof rgbR.value != undefined ? Number(rgbR.value) : props.color?.rgba?.r || 0,
      g: typeof rgbG.value != undefined ? Number(rgbG.value) : props.color?.rgba?.g || 0,
      b: typeof rgbB.value != undefined ? Number(rgbB.value) : props.color?.rgba?.b || 0,
      a: typeof rgbA.value != undefined ? Number(rgbA.value) : props.color?.rgba?.a || 0,
      source: "rgb",
    })
  }
}
</script>

<template>
  <div class="color_setting">
    <div class="color_setting_value">
      <div class="color_box" :style="{ backgroundColor: bgColor }"></div>
      <div class="color_collect" @click="handleHeart">
        <svg class="svg_icon">
          <svg viewBox="0 0 16 16">
            <desc>收藏</desc>
            <path
              d="M15.2,5.1l-3.8-0.5c-0.3,0-0.6-0.2-0.7-0.5L8.9,0.7C8.7,0.3,8.4,0.1,8,0.1c-0.4,0-0.7,0.2-0.9,0.5L5.4,4C5.3,4.3,5,4.5,4.7,4.6L0.8,5.1C0,5.2-0.3,6.2,0.3,6.7l2.8,2.6c0.2,0.2,0.3,0.5,0.3,0.8l-0.7,3.7c-0.1,0.6,0.4,1.1,1,1.1c0.2,0,0.3,0,0.5-0.1l3.1-1.6v-2.2c-0.2,0.1-0.4,0.1-0.6,0.2l-1.5,0.8l0.3-1.6c0.2-1-0.2-1.9-0.9-2.6L3.3,6.8L5,6.5c1-0.1,1.8-0.7,2.3-1.6L8,3.5l0.7,1.5C9.2,5.8,10,6.4,11,6.5l1.7,0.2l-1.2,1.1c0,0,0,0.1-0.1,0.1h2.9l1.4-1.3C16.3,6.2,16,5.2,15.2,5.1z"
            ></path>
            <path
              d="M14,11h-1v-1c0-0.5-0.5-1-1-1s-1,0.5-1,1v1h-1c-0.5,0-1,0.5-1,1s0.5,1,1,1h1v1c0,0.5,0.5,1,1,1s1-0.5,1-1v-1h1c0.5,0,1-0.5,1-1S14.5,11,14,11z"
            ></path>
          </svg>
        </svg>
      </div>
    </div>
    <div class="color_setting_custom">
      <div class="color_setting_hex">
        <span class="color_setting_label">#</span>
        <div class="color_custom">
          <input
            v-model="hex"
            class="color_input"
            :class="{ focus: hexFocus }"
            spellcheck="false"
            data-len="6"
            type="text"
            @change="handleInput($event, 'hex')"
            @blur="inputBlurFocus($event, 'blur', 'hex')"
            @focus="inputBlurFocus($event, 'focus', 'hex')"
            @input="hex = ($event.target as HTMLInputElement).value"
          />
          <span class="color_format">HEX</span>
        </div>
      </div>
      <div class="color_setting_rgb">
        <div class="color_custom">
          <input
            v-model="rgbR"
            class="color_input"
            :class="{ focus: rgbRFocus }"
            spellcheck="false"
            data-min="0"
            data-max="255"
            type="text"
            @change="handleInput($event, 'rgb')"
            @blur="inputBlurFocus($event, 'blur', 'rgbR')"
            @focus="inputBlurFocus($event, 'focus', 'rgbR')"
            @input="rgbR = ($event.target as HTMLInputElement).value"
          />
          <span class="color_format">R</span>
        </div>
        <div class="color_custom">
          <input
            v-model="rgbG"
            class="color_input"
            :class="{ focus: rgbGFocus }"
            spellcheck="false"
            data-min="0"
            data-max="255"
            type="text"
            @change="handleInput($event, 'rgb')"
            @blur="inputBlurFocus($event, 'blur', 'rgbG')"
            @focus="inputBlurFocus($event, 'focus', 'rgbG')"
            @input="rgbG = ($event.target as HTMLInputElement).value"
          />
          <span class="color_format">G</span>
        </div>
        <div class="color_custom">
          <input
            v-model="rgbB"
            class="color_input"
            :class="{ focus: rgbBFocus }"
            spellcheck="false"
            data-min="0"
            data-max="255"
            type="text"
            @change="handleInput($event, 'rgb')"
            @blur="inputBlurFocus($event, 'blur', 'rgbB')"
            @focus="inputBlurFocus($event, 'focus', 'rgbB')"
            @input="rgbB = ($event.target as HTMLInputElement).value"
          />
          <span class="color_format">B</span>
        </div>
        <div class="color_custom">
          <input
            v-model="rgbA"
            class="color_input"
            :class="{ focus: rgbAFocus }"
            spellcheck="false"
            data-min="0"
            data-max="1"
            type="text"
            @change="handleInput($event, 'rgb')"
            @blur="inputBlurFocus($event, 'blur', 'rgbA')"
            @focus="inputBlurFocus($event, 'focus', 'rgbA')"
            @input="rgbA = ($event.target as HTMLInputElement).value"
          />
          <span class="color_format">A</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color_setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color_setting .color_setting_value {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color_setting .color_setting_value .color_box {
  width: 24px;
  height: 24px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
}

.color_setting .color_setting_value .color_collect {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  align-items: center;
  justify-content: center;
}

.color_setting .color_setting_value .color_collect .svg_icon {
  width: 16px;
  height: 16px;
  fill: #fff;
}

.color_setting .color_setting_value:hover .color_collect {
  display: flex;
}

.color_setting .color_setting_custom {
  display: flex;
  align-items: center;
  flex: 1;
}

.color_setting .color_setting_custom .color_custom {
  text-align: center;
  width: 26px;
  line-height: 1.4;
}

.color_setting .color_setting_custom .color_custom .color_input {
  width: 100%;
  border: none;
  background-color: transparent;
  font-size: 16px;
  color: #666;
  border-bottom: 1px solid #b0b0b0;
  text-align: center;
  padding: 2px 0;
}

.color_setting .color_setting_custom .color_custom .color_input:focus {
  border-color: var(--color-picker-color-primary);
}

.color_setting .color_setting_custom .color_custom .color_input:focus::-moz-selection {
  color: var(--color-white);
  background: var(--color-picker-color-primary);
}

.color_setting .color_setting_custom .color_custom .color_input:focus::selection {
  color: var(--color-white);
  background: var(--color-picker-color-primary);
}

.color_setting .color_setting_custom .color_custom .color_format {
  height: 16px;
  font-size: 12px;
  line-height: 32px;
  color: #9d9d9d;
}

.color_setting .color_setting_custom .color_setting_hex,
.color_setting .color_setting_custom .color_setting_rgb {
  display: flex;
}

.color_setting .color_setting_custom .color_setting_rgb .color_custom {
  margin: 0 4px;
}

.color_setting .color_setting_custom .color_setting_hex {
  margin-right: 8px;
}

.color_setting .color_setting_custom .color_setting_hex .color_setting_label {
  margin-left: 8px;
  margin-right: 4px;
  color: #b0b0b0;
  font-size: 16px;
}

.color_setting .color_setting_custom .color_setting_hex .color_custom {
  width: 58px;
}
</style>
