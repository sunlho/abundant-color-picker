<script lang="ts" setup>
import { colorPredefine } from "../constants"
import { onChangeColorParams } from "../type"

const emit = defineEmits<{
  (event: "change", value: onChangeColorParams): void
}>()

const handleChange = (color: string) => {
  "colorful" == color
    ? emit("change", {
        source: "picker",
      })
    : "transparent" == color
    ? emit("change", {
        source: "transparent",
      })
    : emit("change", {
        hex: color,
        source: "hex",
      })
}
</script>

<template>
  <div class="color_predefine">
    <template v-for="(column, columnIndex) in colorPredefine.solid" :key="columnIndex">
      <div class="color_column">
        <template v-for="(color, colorIndex) in column" :key="colorIndex">
          <div
            class="color_box"
            :class="{
              transparent: color === 'transparent',
              colorful: color === 'colorful',
            }"
            :style="{ backgroundColor: color }"
            @click="handleChange(color)"
          ></div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.color_predefine {
  display: flex;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  width: fit-content;
  margin: 0 auto;
}

.color_predefine .color_column {
  display: flex;
  flex-direction: column;
}

.color_predefine .color_column .color_box {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
  cursor: pointer;
}

.color_predefine .color_column .color_box.transparent {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMzQjg0MDJBMzQwRjExRTVCOENFRjNCREUwQTgxQkRDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMzQjg0MDJCMzQwRjExRTVCOENFRjNCREUwQTgxQkRDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzNCODQwMjgzNDBGMTFFNUI4Q0VGM0JERTBBODFCREMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzNCODQwMjkzNDBGMTFFNUI4Q0VGM0JERTBBODFCREMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4rBDndAAAABlBMVEX/////Ly9Sl+KnAAAAGUlEQVR42mJgwA0Y8ckxjsqNyo0sOYAAAwBY0QA4WlKXIgAAAABJRU5ErkJggg==)
    no-repeat 50%;
}

.color_predefine .color_column .color_box.colorful {
  background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNTRBN0M0MjM0MDMxMUU1QkI3NkIxQjU4NTgzNzE3NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNTRBN0M0MzM0MDMxMUU1QkI3NkIxQjU4NTgzNzE3NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY1NEE3QzQwMzQwMzExRTVCQjc2QjFCNTg1ODM3MTc2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY1NEE3QzQxMzQwMzExRTVCQjc2QjFCNTg1ODM3MTc2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAHAAcAwERAAIRAQMRAf/EAIUAAAIDAQAAAAAAAAAAAAAAAAYIBAUHCQEAAgIDAQAAAAAAAAAAAAAABwgFBgIJCgQQAAAEBAUEAAcBAAAAAAAAAAECAwQAERIGIVETFAUxIhUHQWGBMiU1FwgRAAECBQMBBwUAAAAAAAAAAAEAAhEDBAUGMRITIUFRcSIUFgcjMyQXCP/aAAwDAQACEQMRAD8AQv2F67dNirKkQMFMxmARsbs16a+AJQAx/IWPIBKzCzzHK/BoqAlVTPSYoxPXIDZuGiZLAasTpzWhN/wDQrdmRZQJYBKBfda1soFzinfxi37JLXEKz3pdaU4G/ueX6qEVdeE7U6NweoOH5pFRM2mFYCExDOPHSZYacg7lzb0GWz6ZwIikrvv/ACtdNv3Lx9yWs185xyjgifJ8ayDWdgQ5pAdJuSaitIjiBCiIBMegDFvqfnLHrVbpjrtUskho6F3WJJgGwbE9fDpqYDqm9/nT5KprtklJbKhwlumugHPIYzytLjF7iGgkNO0Exe6DGxe5rTR8m/eNTC08a6aAj2aayJ0zBLDEDAAhCvZX88UtzeRRmMvsPetytvoZLJbQ1zSIdhBQ7v3NdWmeeVIwMP2BM5d8VK8DYahdRnXKmIAyNGF+z18lp2uXL/KpYqTZSyy9ysn5jCOzUAyQ5GzhWc8yGfdg7kcSO5Fn4wpeG6yp41YYjxWnez/T1v3a3Nzbbj0iOXBanFBQDvHqOGcDuw5LPoncTnGA0W1XCM7qJUpjS8wglD/hyXmdvtuyfSXzgj+6zwxijP72PBu3I7d6uM4tN/8AUdYrn+lQR1Y+nuE6PumECq6x2mKL+A7OVu3VNzw/6025lo0d04HNT9zy6p28V5eJqAvwXnfhV9M4l/r8CKv5Hp1//9k=)
    no-repeat 50%;
}

.color_predefine .color_column .color_box:hover {
  position: relative;
  transform: scale(1.3);
  z-index: 1;
}

.color_predefine .color_column:first-child .color_box:first-child {
  border-top-left-radius: 4px;
}

.color_predefine .color_column:first-child .color_box:last-child {
  border-bottom-left-radius: 4px;
}

.color_predefine .color_column:last-child .color_box:first-child {
  border-top-right-radius: 4px;
}

.color_predefine .color_column:last-child .color_box:last-child {
  border-bottom-right-radius: 4px;
}
</style>
