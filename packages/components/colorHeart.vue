<script lang="ts" setup>
import { ref } from "vue"
import { onChangeColorParams, onHeartRemoveColor } from "../type"

const props = defineProps<{
  heart: string[]
}>()

const emit = defineEmits<{
  (event: "change", value: onChangeColorParams): void
  (event: "heart", value: onHeartRemoveColor): void
}>()

const showDelBtn = ref(false)

const handleChange = (e: string) => {
  emit("change", {
    source: "heart",
    color: e,
  })
}

const handleHeat = (index: number) => {
  emit("heart", {
    type: "remove",
    index: index,
  })
}
</script>

<template>
  <div v-if="heart.length" class="color_heart">
    <div class="heart_title">收藏</div>
    <div class="heart_list">
      <div v-for="(color, index) in heart" :key="index" class="color_box" :style="{ background: color }" @click="handleChange(color)">
        <div v-if="showDelBtn" class="color_del" @click.stop="handleHeat(index)">
          <svg class="svg_icon">
            <svg viewBox="0 0 26 26">
              <desc>缩小</desc>
              <rect x="9" y="12" width="9" height="1"></rect>
            </svg>
          </svg>
        </div>
      </div>
      <div class="color_btn" @click="showDelBtn = !showDelBtn">
        <svg class="svg_icon">
          <svg viewBox="0 0 16 16">
            <desc>取消收藏</desc>
            <path
              d="M15.2,5.1l-3.8-0.5c-0.3,0-0.6-0.2-0.7-0.5L8.9,0.7C8.7,0.3,8.4,0.1,8,0.1c-0.4,0-0.7,0.2-0.9,0.5L5.4,4C5.3,4.3,5,4.5,4.7,4.6L0.8,5.1C0,5.2-0.3,6.2,0.3,6.7l2.8,2.6c0.2,0.2,0.3,0.5,0.3,0.8l-0.7,3.7c-0.1,0.6,0.4,1.1,1,1.1c0.2,0,0.3,0,0.5-0.1l3.1-1.6v-2.2c-0.2,0.1-0.4,0.1-0.6,0.2l-1.5,0.8l0.3-1.6c0.2-1-0.2-1.9-0.9-2.6L3.3,6.8L5,6.5c1-0.1,1.8-0.7,2.3-1.6L8,3.5l0.7,1.5C9.2,5.8,10,6.4,11,6.5l1.7,0.2l-1.2,1.1c0,0,0,0.1-0.1,0.1h2.9l1.4-1.3C16.3,6.2,16,5.2,15.2,5.1z"
            ></path>
            <path d="M14,11h-4c-0.5,0-1,0.5-1,1s0.5,1,1,1h4c0.5,0,1-0.5,1-1S14.5,11,14,11z"></path>
          </svg>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color_heart {
  display: flex;
  flex-direction: column;
}

.color_heart .heart_title {
  font-size: 12px;
  line-height: 32px;
}

.color_heart .heart_list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-row-gap: 7px;
  grid-column-gap: 6px;
  justify-items: center;
}

.color_heart .heart_list .color_box {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  position: relative;
}

.color_heart .heart_list .color_box:hover {
  position: relative;
  transform: scale(1.3);
  z-index: 1;
}

.color_heart .heart_list .color_box .color_del {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.color_heart .heart_list .color_box .color_del .svg_icon {
  width: 100%;
  height: 100%;
  fill: #fff;
}

.color_heart .heart_list .color_btn {
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

.color_heart .heart_list .color_btn .svg_icon {
  width: 16px;
  height: 16px;
  fill: #999;
}

.color_heart .heart_list .color_btn .svg_icon:hover {
  fill: var(--color-picker-color-primary);
}
</style>
