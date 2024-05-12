<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import GradientColorPicker from "./AbundantColorPicker.vue"
import { ColorPickerBoxType } from "./constants"

const props = withDefaults(
  defineProps<{
    modelValue: string
    type?: ColorPickerBoxType
  }>(),
  {
    type: ColorPickerBoxType.PoPupPanel,
  }
)
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const colorPicker = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue)
  },
})

const pickerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const panelStyle = ref({})
const showPanel = ref(false)

const triggerRef = ref<HTMLElement | null>(null)

const handlePanel = () => {
  if (showPanel.value) {
    showPanel.value = false
    panelStyle.value = {}
  } else {
    showPanel.value = true
    handleScroll()
    setTimeout(() => {
      panelRef.value?.classList.add("open_panel")
      setTimeout(() => {
        panelRef.value?.classList.add("down_panel")
      }, 300)
    }, 10)
  }
}

const handleClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (pickerRef.value) {
    let isContain = pickerRef.value.contains(target)
    if (target.className && typeof target.className === "object") {
      isContain = true
    }
    if (!isContain) {
      showPanel.value = false
    }
  }
}

const handleScroll = () => {
  let e = {
    top: 0,
    left: 0,
  }
  let t = triggerRef.value?.getBoundingClientRect() || {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }
  if (t.top < 480) {
    e.top = Math.round(t.top) + Math.floor(t.height) + 10
  } else {
    e.top = Math.floor(t.top) - 310
  }
  e.left = t.left - (280 - Math.floor(t.width)) / 2
  panelStyle.value = {
    position: "fixed",
    top: e.top + "px",
    left: e.left + "px",
  }
}

onMounted(() => {
  if (props.type === ColorPickerBoxType.PoPupPanel) {
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)
    window.addEventListener("click", handleClick)
  }
})

onBeforeUnmount(() => {
  if (props.type === ColorPickerBoxType.PoPupPanel) {
    window.removeEventListener("scroll", handleScroll)
    window.removeEventListener("resize", handleScroll)
    window.removeEventListener("click", handleClick)
  }
})
</script>

<template>
  <div class="custom_color_box color_picker_grid">
    <div v-if="ColorPickerBoxType.PoPupPanel == type" class="custom_color_picker" ref="pickerRef">
      <div class="color_trigger" :style="{ background: colorPicker }" @click="handlePanel" ref="triggerRef">
        <div v-if="showPanel" class="color_panel" :style="{ ...panelStyle }" ref="panelRef">
          <gradient-color-picker v-model="colorPicker"></gradient-color-picker>
        </div>
      </div>
    </div>
    <div v-if="ColorPickerBoxType.Panel == type">
      <gradient-color-picker v-model="colorPicker"></gradient-color-picker>
    </div>
  </div>
</template>

<style scoped>
.color_picker_grid {
  background-size: 12px 12px;
  background-repeat: repeat;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}

.custom_color_picker {
  position: relative;
  width: 68px;
  height: 32px;
  border-radius: 4px;
}

.custom_color_picker .color_trigger {
  display: inline-block;
  box-sizing: border-box;
  width: 68px;
  height: 32px;
  border-radius: 4px;
  font-size: 0;
  position: relative;
  cursor: pointer;
  border: 1px solid var(--color-picker-border-color-base);
}

.custom_color_picker .color_panel {
  position: absolute;
  height: 0;
  transition: height 0.3s;
  border-radius: 3px;
  z-index: 1999;
  background-color: #fff;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2);
}

.custom_color_picker .color_panel.open_panel {
  height: auto;
}
</style>
