<script lang="ts" setup>
import { ref, reactive, watch, computed, onMounted } from "vue"
import normalPredefine from "./components/normalPredefine.vue"
import colorGradient from "./components/colorGradient.vue"
import colorDirection from "./components/colorDirection.vue"
import colorAlpha from "./components/colorAlpha.vue"
import colorSetting from "./components/colorSetting.vue"
import colorHeart from "./components/colorHeart.vue"
import panelColorPicker from "./components/panelColorPicker.vue"
import colorSlide from "./components/colorSlide.vue"
import linearPredefine from "./components/linearPredefine.vue"
import radialPredefine from "./components/radialPredefine.vue"
import { colorObj, colorToObj, trim, type colorType } from "./utils"
import { gradientColorPredefine, solidColorPredefine, ColorPickerPanelType } from "./constants"
import tinyColor from "tinycolor2"
import { ElMessage } from "element-plus"
import { gradientColor, onChangeColorParams, onHeartColorParams } from "./type"

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue)
  },
})

const color = ref<colorObj>()
const linearColor = ref<gradientColor[]>([
  { color: gradientColorPredefine[0][0], left: 0 },
  { color: gradientColorPredefine[0][1], left: 100 },
])
const radialColor = ref<gradientColor[]>([
  { color: gradientColorPredefine[0][0], left: 0 },
  { color: gradientColorPredefine[0][1], left: 100 },
])

const panelType = ref(ColorPickerPanelType.Solid)
const panelTypeList = reactive([
  { name: "纯色", type: ColorPickerPanelType.Solid },
  { name: "线性渐变", type: ColorPickerPanelType.Linear },
  { name: "径向渐变", type: ColorPickerPanelType.Radial },
])
const heartList = ref<string[]>(JSON.parse(localStorage.getItem("designHeartColor") || "[]"))
const showPanel = ref(false)
const angle = ref(90)
const direction = ref(0)
const directionList = [
  "left top",
  "center top",
  "right top",
  "left center",
  "center center",
  "right center",
  "left bottom",
  "center bottom",
  "right bottom",
]

const initColor = (value: string) => {
  if (value.indexOf("linear-gradient") > -1) {
    panelType.value = ColorPickerPanelType.Linear
    const { colorList, angle: gradientAngle } = gradientChangeColor(value, "linear")
    linearColor.value = colorList
    angle.value = gradientAngle
    if (!radialColor.value) {
      radialColor.value = colorList
    }
  } else if (value.indexOf("radial-gradient") > -1) {
    panelType.value = ColorPickerPanelType.Radial
    const { colorList, direction: gradientDirection } = gradientChangeColor(value, "radial")
    radialColor.value = colorList
    direction.value = gradientDirection
    if (!linearColor.value) {
      linearColor.value = colorList
    }
  } else {
    panelType.value = ColorPickerPanelType.Solid
    color.value = colorToObj(value)
    if (!linearColor.value) {
      linearColor.value = [
        { color: gradientColorPredefine[0][0], left: 0 },
        { color: gradientColorPredefine[0][1], left: 100 },
      ]
    }
    if (!radialColor.value) {
      radialColor.value = [
        { color: gradientColorPredefine[0][0], left: 0 },
        { color: gradientColorPredefine[0][1], left: 100 },
      ]
    }
  }
  if (!color.value) color.value = colorToObj(solidColorPredefine.red[0])
}

function gradientChangeColor(value: string, type: "radial"): { direction: number; colorList: { color: string; left: number }[] }
function gradientChangeColor(value: string, type: "linear"): { angle: number; colorList: { color: string; left: number }[] }
function gradientChangeColor(value: string, type: "linear" | "radial") {
  const t = value.split(",")
  const i = value.substring(t[0].length + 1, value.length - 1)
  const a = i.split("%")
  const n: {
    color: string
    left: number
  }[] = []
  let o:
    | {
        angle: number
      }
    | {
        direction: number
      }
    | {} = {}
  if (type === "linear") {
    o = {
      angle: Number(trim(t[0].replace("linear-gradient(", "").replace("deg", ""), "around")),
    }
  } else {
    const e = directionList.indexOf(trim(t[0].replace("radial-gradient(farthest-side at", ""), "around"))
    o = {
      direction: e > -1 ? e : 0,
    }
  }
  a.forEach((e) => {
    if (e) {
      if (e.indexOf("#") > -1) {
        const t = tinyColor(e.substring(e.indexOf("#"), e.indexOf("#") + 7)).toRgb()
        n.push({
          color: `rgba(${t.r},${t.g},${t.b},${t.a})`,
          left: Number(trim(e.substring(e.indexOf("#") + 7), "around")),
        })
      } else {
        const t = e.split(")")
        n.push({
          color: ("," == t[0][0] ? t[0].substring(1, t[0].length) : t[0]) + ")",
          left: Number(trim(t[1], "around")),
        })
      }
    }
  })
  return {
    ...o,
    colorList: n,
  }
}

function onHeartColor(e: onHeartColorParams) {
  if ("add" == e.type) {
    if (heartList.value.indexOf(e.color) > -1) {
      ElMessage.warning("该颜色已被收藏，请勿重复收藏")
    } else {
      heartList.value.push(e.color)
    }
  } else {
    heartList.value.splice(e.index, 1)
  }
  localStorage.setItem("designHeartColor", JSON.stringify(heartList.value))
}

const onSlideColor = (e: number | string) => {
  angle.value = Number(e)
  onChangeColor({
    source: "linear",
    gradient: linearColor.value,
  })
}

const onDirectionColor = (e: number | string) => {
  direction.value = Number(e)
  onChangeColor({
    source: "radial",
    gradient: radialColor.value,
  })
}

const onChangeColor = (params: onChangeColorParams) => {
  if ("linear" == params.source) {
    params.gradient && (linearColor.value = params.gradient)
    let t = ""
    params.gradient?.forEach((params) => {
      let i = colorToObj(params.color).rgba || { r: 0, g: 0, b: 0, a: 1 }
      t += `,rgba(${i.r},${i.g},${i.b},${i.a}) ${params.left}%`
    })
    modelValue.value = `linear-gradient(${angle.value}deg${t})`
  } else if ("radial" == params.source) {
    radialColor.value = params.gradient
    let t = ""
    params.gradient?.forEach((params) => {
      let i = colorToObj(params.color).rgba || { r: 0, g: 0, b: 0, a: 1 }
      t += `,rgba(${i.r},${i.g},${i.b},${i.a}) ${params.left}%`
    })
    modelValue.value = `radial-gradient(farthest-side at ${directionList[direction.value]}${t})`
  } else if ("picker" == params.source) {
    showPanel.value = true
  } else if ("transparent" == params.source) {
    modelValue.value = "transparent"
  } else if ("heart" == params.source) {
    modelValue.value = params.color
  } else {
    const oldHue = color.value?.hsl?.h
    color.value = colorToObj(params, oldHue)
    let t = color.value.rgba || { r: 0, g: 0, b: 0, a: 1 }
    modelValue.value = `rgba(${t.r},${t.g},${t.b},${t.a})`
  }
}

watch(
  () => modelValue.value,
  (newValue) => {
    // TODO 为什么这里会返回一个数组
    const value = newValue as string | string[]
    if (Array.isArray(value)) {
      initColor(newValue[0])
      return
    }
    initColor(newValue)
  },
  {
    immediate: true,
  }
)

const typeLineStyle = computed(() => {
  return {
    transform: `translate(${(280 / 6 - (ColorPickerPanelType.Solid === panelType.value ? 12 : 24) + (280 * panelType.value) / 3).toFixed(
      2
    )}px, 0px)`,
    width: ColorPickerPanelType.Solid === panelType.value ? "24px" : "48px",
  }
})
</script>

<template>
  <div class="abundant_color_picker" @click.stop>
    <div class="color_tab_type">
      <div
        v-for="(item, index) in panelTypeList"
        :key="index"
        :class="{ active: panelType === item.type }"
        @click="panelType = item.type"
        class="type"
      >
        {{ item.name }}
      </div>
      <div class="type_line" :style="typeLineStyle"></div>
    </div>
    <div class="color_panel_content">
      <div v-if="ColorPickerPanelType.Solid === panelType" class="panel_base">
        <normal-predefine style="margin-bottom: 16px" @change="onChangeColor" />
        <color-alpha style="margin-bottom: 12px" :color="color" @change="onChangeColor" />
        <color-setting :color="color" @heart="onHeartColor" @change="onChangeColor" />
        <color-heart :heart="heartList" @heart="onHeartColor" @change="onChangeColor" />
      </div>
      <div v-if="ColorPickerPanelType.Linear === panelType" class="panel_base">
        <linear-predefine style="margin-bottom: 16px" @change="onChangeColor" />
        <color-gradient
          style="margin-bottom: 16px"
          type="linear"
          :color="linearColor"
          :angle="angle"
          @change="onChangeColor"
          @heart="onHeartColor"
        />
        <color-slide :angle="angle" @slide="onSlideColor" />
        <color-heart :heart="heartList" @heart="onHeartColor" @change="onChangeColor" />
      </div>
      <div v-if="ColorPickerPanelType.Radial === panelType" class="panel_base">
        <radial-predefine style="margin-bottom: 16px" @change="onChangeColor" />
        <color-gradient
          style="margin-bottom: 16px"
          type="radial"
          :color="radialColor"
          :direction="direction"
          :directionList="directionList"
          @change="onChangeColor"
          @heart="onHeartColor"
        />
        <color-direction
          style="margin-bottom: 8px"
          :color="radialColor"
          :direction="direction"
          :directionList="directionList"
          @direction="onDirectionColor"
        />
        <color-heart :heart="heartList" @heart="onHeartColor" @change="onChangeColor" />
      </div>
    </div>
    <panel-color-picker
      v-model:visible="showPanel"
      :color="color"
      width="280px"
      height="380px"
      @heart="onHeartColor"
      @change="onChangeColor"
    />
  </div>
</template>

<style scoped>
.abundant_color_picker {
  position: relative;
  width: 280px;
  background-color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.abundant_color_picker .color_tab_type {
  width: 100%;
  height: 38px;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  cursor: not-allowed;
}

.abundant_color_picker .color_tab_type .type {
  flex: 1;
  line-height: 38px;
  text-align: center;
  color: var(--color-design-13);
  font-size: 12px;
  cursor: pointer;
  position: relative;
}

.abundant_color_picker .color_tab_type .type:nth-child(-n + 2):after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  margin-top: -6px;
  width: 1px;
  height: 12px;
  background-color: #d8d8db;
}

.abundant_color_picker .color_tab_type .type.active {
  font-weight: 700;
  color: var(--color-picker-color-primary);
}

.abundant_color_picker .color_tab_type .type_line {
  width: 24px;
  height: 2px;
  background-color: var(--color-picker-color-primary);
  position: absolute;
  bottom: 0;
  transition: transform 0.3s linear;
}

.abundant_color_picker .color_panel_content .panel_base {
  padding: 10px;
}
</style>
