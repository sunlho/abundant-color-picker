<script lang="ts" setup>
import { computed, ref, watch, nextTick, onMounted } from "vue"
import { colorToObj, colorType } from "../utils"
import PanelColorPicker from "./panelColorPicker.vue"
import { ElMessage } from "element-plus"
import { onChangeColorParams, onHeartAddColor } from "../type"

const props = defineProps<{
  type: "linear" | "radial"
  color: Array<{ left: number; color: string }>
  angle?: number
  direction?: number
  directionList?: Array<string>
}>()

const emit = defineEmits<{
  (event: "change", payload: onChangeColorParams): void
  (event: "heart", payload: onHeartAddColor): void
}>()

const containerRef = ref<HTMLElement | null>(null)

const colorList = ref(props.color)
const colorActive = ref<number | null>(0)
const showPanel = ref(false)

const bgColor = computed(() => {
  let gradient = ""
  colorList.value.forEach((color) => {
    let rgba = colorToObj(color.color).rgba || { r: 0, g: 0, b: 0, a: 1 }
    gradient += `,rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a}) ${color.left}%`
  })
  return `linear-gradient(to right ${gradient})`
})

const bgAngleColor = computed(() => {
  let gradient = ""
  colorList.value.forEach((color) => {
    let rgba = colorToObj(color.color).rgba || { r: 0, g: 0, b: 0, a: 1 }
    gradient += `,rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a}) ${color.left}%`
  })
  if (props.type === "linear") {
    return `linear-gradient(${props.angle}deg ${gradient})`
  } else {
    return `radial-gradient(farthest-side at ${props.directionList?.[Number(props.direction)]} ${gradient})`
  }
})

const solidColor = computed(() => {
  return colorToObj(colorList.value[colorActive.value || 0]?.color || "")
})

const handleSetting = () => {
  if (colorActive.value === null) return false
}

const onHeart = (e?: onHeartAddColor) => {
  const color = e || {
    type: "add",
    color: bgAngleColor.value,
  }
  emit("heart", color)
}

const onChangeColor = (e: colorType) => {
  const h = solidColor.value.hsl?.h
  const rgba = colorToObj(e, h).rgba || { r: 0, g: 0, b: 0, a: 1 }
  colorList.value[colorActive.value || 0].color = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
  emit("change", {
    gradient: colorList.value,
    source: props.type,
  })
}

const handleChange = (e: MouseEvent | TouchEvent, t?: boolean) => {
  !t && e.preventDefault()
  if (!containerRef) return
  const n = containerRef.value?.clientWidth || 0
  const o = Number(containerRef.value?.getBoundingClientRect().left) + window.scrollX
  const s = (e as MouseEvent).pageX || ((e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : 0)
  const l = s - o
  const left = l < 0 ? 0 : l > n ? 100 : Number(((l / n) * 100).toFixed(2))
  if (colorActive.value !== null) {
    colorList.value[colorActive.value].left = left
    if (t) {
      colorList.value.sort((e, t) => e.left - t.left)
      colorActive.value = getColorIndex(left, "left")
    }
  } else if (t) {
    const index = getColorIndex(left, "diff")
    colorList.value.splice(index, 0, {
      left: left,
      color: colorList.value[index].color,
    })
    colorActive.value = index
  }
  emit("change", {
    gradient: colorList.value,
    source: props.type,
  })
}

const handleGradient = (e: "add" | "remove") => {
  if (e === "add") {
    if (colorList.value.length > 10) {
      return ElMessage.warning("最多保留十个节点颜色")
    }
    const e = colorActive.value && colorActive.value > 0 ? colorActive.value : 1
    const t = (colorList.value[e].left - colorList.value[e - 1].left) / 2 + colorList.value[e - 1].left
    colorList.value.splice(e, 0, {
      left: t,
      color: colorList.value[e - 1].color,
    })
    colorActive.value = e
  } else {
    if (colorList.value.length < 3) {
      return ElMessage.warning("请至少保留两个节点颜色")
    }
    if (colorActive.value === null) {
      return ElMessage.warning("请至少选择一个节点颜色进行删除")
    }
    colorActive.value && colorList.value.splice(colorActive.value, 1)
  }
  emit("change", {
    gradient: colorList.value,
    source: props.type,
  })
}

const getColorIndex = (left: number, type: "left" | "diff") => {
  let index = 0
  for (let i = 0; i < colorList.value.length; i++) {
    if (type === "left") {
      if (colorList.value[i].left === left) {
        index = i
      }
    } else if (type === "diff") {
      if (colorList.value[i].left > left) {
        index = i
        break
      }
    }
  }
  return index
}

const handleMouseDown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.className.includes("item_gradient") && target.dataset.index) {
    colorActive.value = Number(target.dataset.index)
  } else {
    colorActive.value = null
  }
  window.addEventListener("mousemove", handleChange)
  window.addEventListener("mouseup", handleMouseUp)
}

const handleMouseUp = (e: MouseEvent) => {
  handleChange(e, true)
  unbindEventListeners()
}

const unbindEventListeners = () => {
  window.removeEventListener("mousemove", handleChange)
  window.removeEventListener("mouseup", handleMouseUp)
}

watch(
  () => props.color,
  (e) => {
    colorList.value = e
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="color_gradient">
    <div class="slide_gradient" :style="{ background: bgColor }">
      <div class="item_gradient" ref="containerRef" @mousedown="handleMouseDown" @touchmove="handleChange" @touchstart="handleChange">
        <div
          v-for="(color, index) in colorList"
          :key="index"
          class="item_point"
          :class="{ active: colorActive == index }"
          :style="{ left: color.left + '%' }"
          :data-index="index"
        >
          <div class="item_circle" :data-index="index">
            <span class="item_round" :data-index="index"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="slide_setting">
      <div class="setting_left">
        <div class="color_btn" @click="() => onHeart()">
          <svg class="svg_icon">
            <svg viewBox="0 0 16 16">
              <desc>收藏</desc>
              <path
                d="M15.2,5.1l-3.8-0.5c-0.3,0-0.6-0.2-0.7-0.5L8.9,0.7C8.7,0.3,8.4,0.1,8,0.1c-0.4,0-0.7,0.2-0.9,0.5L5.4,4C5.3,4.3,5,4.5,4.7,4.6L0.8,5.1C0,5.2-0.3,6.2,0.3,6.7l2.8,2.6c0.2,0.2,0.3,0.5,0.3,0.8l-0.7,3.7c-0.1,0.6,0.4,1.1,1,1.1c0.2,0,0.3,0,0.5-0.1l3.1-1.6v-2.2c-0.2,0.1-0.4,0.1-0.6,0.2l-1.5,0.8l0.3-1.6c0.2-1-0.2-1.9-0.9-2.6L3.3,6.8L5,6.5c1-0.1,1.8-0.7,2.3-1.6L8,3.5l0.7,1.5C9.2,5.8,10,6.4,11,6.5l1.7,0.2l-1.2,1.1c0,0,0,0.1-0.1,0.1h2.9l1.4-1.3C16.3,6.2,16,5.2,15.2,5.1z"
              />
              <path
                d="M14,11h-1v-1c0-0.5-0.5-1-1-1s-1,0.5-1,1v1h-1c-0.5,0-1,0.5-1,1s0.5,1,1,1h1v1c0,0.5,0.5,1,1,1s1-0.5,1-1v-1h1c0.5,0,1-0.5,1-1S14.5,11,14,11z"
              />
            </svg>
          </svg>
        </div>
        <div class="color_btn setting" @click="handleSetting"></div>
      </div>
      <div class="setting_right">
        <div class="color_btn" @click="handleGradient('add')">
          <svg class="svg_icon">
            <svg viewBox="0 0 24 24">
              <desc>增加渐变色</desc>
              <g>
                <path
                  fill="#e1e2e5"
                  d="M20,24H4c-2.2,0-4-1.8-4-4V4c0-2.2,1.8-4,4-4h16c2.2,0,4,1.8,4,4v16C24,22.2,22.2,24,20,24z M4,1   C2.3,1,1,2.3,1,4v16c0,1.7,1.3,3,3,3h16c1.7,0,3-1.3,3-3V4c0-1.7-1.3-3-3-3H4z"
                />
              </g>
              <path
                d="M17,11h-4V7c0-0.6-0.4-1-1-1s-1,0.4-1,1v4H7c-0.6,0-1,0.4-1,1s0.4,1,1,1h4v4c0,0.6,0.4,1,1,1s1-0.4,1-1v-4h4  c0.6,0,1-0.4,1-1S17.6,11,17,11z"
              />
            </svg>
          </svg>
        </div>
        <div class="color_btn" @click="handleGradient('remove')">
          <svg class="svg_icon">
            <svg viewBox="0 0 24 24">
              <desc>删除渐变色</desc>
              <g>
                <path
                  fill="#e1e2e5"
                  d="M20,24H4c-2.2,0-4-1.8-4-4V4c0-2.2,1.8-4,4-4h16c2.2,0,4,1.8,4,4v16C24,22.2,22.2,24,20,24z M4,1   C2.3,1,1,2.3,1,4v16c0,1.7,1.3,3,3,3h16c1.7,0,3-1.3,3-3V4c0-1.7-1.3-3-3-3H4z"
                />
              </g>
              <path d="M7,11h10c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1H7c-0.6,0-1-0.4-1-1l0,0C6,11.4,6.4,11,7,11z" />
            </svg>
          </svg>
        </div>
      </div>
    </div>
    <panel-color-picker
      v-model:visible="showPanel"
      :color="solidColor"
      width="280px"
      height="380px"
      @heart="onHeart"
      @change="onChangeColor"
    ></panel-color-picker>
  </div>
</template>

<style scoped>
.color_gradient .slide_gradient {
  width: 100%;
  height: 14px;
  border-radius: 7px;
  padding: 0 8px;
  cursor: pointer;
  margin-bottom: 10px;
}

.color_gradient .slide_gradient .item_gradient {
  position: relative;
  width: 100%;
  height: 100%;
}

.color_gradient .slide_gradient .item_gradient .item_point {
  cursor: pointer;
  position: absolute;
  top: -1px;
}

.color_gradient .slide_gradient .item_gradient .item_point .item_circle {
  width: 16px;
  height: 16px;
  border: 3px solid #fff;
  background: transparent;
  border-radius: 50%;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
  transform: translate(-8px);
}

.color_gradient .slide_gradient .item_gradient .item_point .item_circle span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 3px;
  width: 3px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.33s;
}

.color_gradient .slide_gradient .item_gradient .item_point.active .item_circle span {
  opacity: 1;
}

.color_gradient .slide_setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color_gradient .slide_setting .color_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  border-radius: 4px;
}

.color_gradient .slide_setting .color_btn.setting {
  background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNTRBN0M0MjM0MDMxMUU1QkI3NkIxQjU4NTgzNzE3NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNTRBN0M0MzM0MDMxMUU1QkI3NkIxQjU4NTgzNzE3NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY1NEE3QzQwMzQwMzExRTVCQjc2QjFCNTg1ODM3MTc2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY1NEE3QzQxMzQwMzExRTVCQjc2QjFCNTg1ODM3MTc2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAHAAcAwERAAIRAQMRAf/EAIUAAAIDAQAAAAAAAAAAAAAAAAYIBAUHCQEAAgIDAQAAAAAAAAAAAAAABwgFBgIJCgQQAAAEBAUEAAcBAAAAAAAAAAECAwQAERIGIVETFAUxIhUHQWGBMiU1FwgRAAECBQMBBwUAAAAAAAAAAAEAAhEDBAUGMRITIUFRcSIUFgcjMyQXCP/aAAwDAQACEQMRAD8AQv2F67dNirKkQMFMxmARsbs16a+AJQAx/IWPIBKzCzzHK/BoqAlVTPSYoxPXIDZuGiZLAasTpzWhN/wDQrdmRZQJYBKBfda1soFzinfxi37JLXEKz3pdaU4G/ueX6qEVdeE7U6NweoOH5pFRM2mFYCExDOPHSZYacg7lzb0GWz6ZwIikrvv/ACtdNv3Lx9yWs185xyjgifJ8ayDWdgQ5pAdJuSaitIjiBCiIBMegDFvqfnLHrVbpjrtUskho6F3WJJgGwbE9fDpqYDqm9/nT5KprtklJbKhwlumugHPIYzytLjF7iGgkNO0Exe6DGxe5rTR8m/eNTC08a6aAj2aayJ0zBLDEDAAhCvZX88UtzeRRmMvsPetytvoZLJbQ1zSIdhBQ7v3NdWmeeVIwMP2BM5d8VK8DYahdRnXKmIAyNGF+z18lp2uXL/KpYqTZSyy9ysn5jCOzUAyQ5GzhWc8yGfdg7kcSO5Fn4wpeG6yp41YYjxWnez/T1v3a3Nzbbj0iOXBanFBQDvHqOGcDuw5LPoncTnGA0W1XCM7qJUpjS8wglD/hyXmdvtuyfSXzgj+6zwxijP72PBu3I7d6uM4tN/8AUdYrn+lQR1Y+nuE6PumECq6x2mKL+A7OVu3VNzw/6025lo0d04HNT9zy6p28V5eJqAvwXnfhV9M4l/r8CKv5Hp1//9k=)
    no-repeat 50%;
}

.color_gradient .slide_setting .color_btn:last-child {
  margin-left: 8px;
}

.color_gradient .slide_setting .color_btn .svg_icon {
  width: 16px;
  height: 16px;
  fill: #999;
}

.color_gradient .slide_setting .color_btn .svg_icon:hover {
  fill: var(--color-picker-color-primary);
}

.color_gradient .slide_setting .setting_left,
.color_gradient .slide_setting .setting_right {
  display: flex;
  align-items: center;
}

.color_gradient .slide_setting .setting_right .color_btn {
  border: none;
}

.color_gradient .slide_setting .setting_right .color_btn .svg_icon {
  width: 100%;
  height: 100%;
}
</style>
