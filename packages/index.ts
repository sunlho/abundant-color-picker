import type { App, Plugin } from "vue"

import AbundantColorPicker from "./AbundantColorPicker.vue"
import AbundantColorPickerBox from "./AbundantColorPickerBox.vue"

export { AbundantColorPicker, AbundantColorPickerBox }

import "./style.css"

const components = {
  AbundantColorPicker,
  AbundantColorPickerBox,
}

export default {
  install(app: App) {
    Object.keys(components).forEach((name) => {
      app.component(name, components[name as keyof typeof components])
    })
  },
} as Plugin
