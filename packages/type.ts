import { colorType } from "./utils"

export interface gradientColor {
  color: string
  left: number
}
export interface linearChangeColor {
  source: "linear"
  gradient: gradientColor[]
}
export interface radialChangeColor {
  source: "radial"
  gradient: gradientColor[]
}
export interface pickerChangeColor {
  source: "picker"
}
export interface transparentChangeColor {
  source: "transparent"
}
export interface heartChangeColor {
  source: "heart"
  color: string
}

export type onChangeColorParams =
  | linearChangeColor
  | radialChangeColor
  | pickerChangeColor
  | transparentChangeColor
  | heartChangeColor
  | colorType

export interface onHeartAddColor {
  type: "add"
  color: string
}

export interface onHeartRemoveColor {
  type: "remove"
  index: number
}

export type onHeartColorParams = onHeartAddColor | onHeartRemoveColor
