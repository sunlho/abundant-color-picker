<script lang="ts" setup>
import colorAlpha from "./colorAlpha.vue"
import colorHue from "./colorHue.vue"
import colorSaturation from "./colorSaturation.vue"
import colorSetting from "./colorSetting.vue"
import { colorObj, colorType } from "../utils"
import { onHeartAddColor } from "../type"

const props = withDefaults(
  defineProps<{
    color?: colorObj
    visible: boolean
    width: string
    height: string
  }>(),
  {
    width: "270px",
    height: "380px",
  }
)

const emit = defineEmits<{
  (event: "change", value: colorType): void
  (event: "heart", value: onHeartAddColor): void
  (event: "update:visible", value: boolean): void
}>()

const onHeart = (e: onHeartAddColor) => {
  emit("heart", e)
}

const onChange = (e: colorType) => {
  emit("change", e)
}

const updateVisible = (e: boolean) => {
  emit("update:visible", e)
}
</script>

<template>
  <div v-if="visible" class="panel_color_picker" :style="{ width, height }">
    <div class="panel_header">
      <div class="handle_close" @click="updateVisible(false)">
        <svg class="svg_icon" viewBox="0 0 8.5 14.1">
          <desc>返回</desc>
          <path
            d="M2.8,7.1l4.9-4.9c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L0.7,6.4c-0.4,0.4-0.4,1,0,1.4l5.7,5.7  c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4L2.8,7.1z"
          />
        </svg>
      </div>
      <div class="title">自定义颜色</div>
    </div>
    <div class="panel_content">
      <color-saturation style="margin-bottom: 16px" :color="color" @change="onChange" />
      <color-hue style="margin-bottom: 8px" :color="color" @change="onChange" />
      <color-alpha style="margin-bottom: 16px" :color="color" @change="onChange" />
      <color-setting :color="color" @heart="onHeart" @change="onChange" />
    </div>
  </div>
</template>

<style scoped>
.panel_color_picker {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.panel_color_picker .panel_header {
  position: relative;
  width: 100%;
  text-align: center;
  height: 36px;
  color: #222;
}

.panel_color_picker .panel_header .handle_close {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
}

.panel_color_picker .panel_header .handle_close .svg_icon {
  width: 9px;
  height: 12px;
  fill: #b8b8b8;
}

.panel_color_picker .panel_header .title {
  line-height: 48px;
  font-size: 14px;
}

.panel_color_picker .panel_content {
  padding: 15px;
}
</style>
