/** 纯色 */
export const solidColorPredefine = {
  red: ["#d81b43", "#e91e4e", "#ec4064", "#f0627d", "#f48fa0"],
  purple: ["#8e24aa", "#9c27b0", "#ab47bc", "#ba68c8", "#ce93d8"],
  deepPurple: ["#512da8", "#5e35b1", "#673ab7", "#7e57c2", "#9575cd"],
  indigo: ["#303f9f", "#3949ab", "#5c6bc0", "#7986cb", "#9fa8da"],
  blue: ["#1e88e5", "#2196f3", "#42a5f5", "#64b5f6", "#90caf9"],
  cyan: ["#00897b", "#009688", "#26a69a", "#80cbc4", "#b2dfdb"],
  green: ["#43a047", "#4caf50", "#81c784", "#a5d6a7", "#c8e6c9"],
  yellow: ["#fbc02d", "#fdd835", "#ffeb3b", "#fff176", "#fff59d"],
  orange: ["#f57c00", "#fb8c00", "#ffa726", "#ffb74d", "#ffcc80"],
  deepOrange: ["#e64a19", "#f4511e", "#ff5722", "#ff8a65", "#ffab91"],
  white: ["transparent", "#ffffff", "#b5b6b6", "#898989", "#5a5a5a", "#373737", "#232323", "#161616", "#000000", "colorful"],
} as const

/** 渐变色 */
export const gradientColorPredefine = [
  ["#ffd500", "#ff9100"],
  ["#fff6b7", "#ea5455"],
  ["#5efce8", "#736efe"],
  ["#68D1FF", "#008FEE"],
  ["#FEC163", "#DE4313"],
  ["#FD6585", "#0D25B9"],
  ["#FAB2FF", "#1904E5"],
  ["#B465D9", "#EE609C"],
  ["#003CFF", "#FF00F7"],
  ["#65FDF0", "#1D6FA3"],
  ["#FF9F9F", "#FF3D3D"],
  ["#FF9A9E", "#FAD0C4"],
  ["#84FAB0", "#8FD3F4"],
  ["#FA709A", "#FEE140"],
  ["#B721FF", "#21D4FD"],
  ["#3D42C4", "#FCC6A9"],
  ["#007ADF", "#00ECBC"],
  ["#FAD0C4", "#EBA0FE"],
  ["#FAD0C4", "#FFD1FF"],
  ["#43E97B", "#38F9D7"],
  ["#667EEA", "#764BA2"],
  ["#0BA360", "#3CBA92"],
  ["#00C6FB", "#005BEA"],
  ["#000000", "#ffffff"],
] as const

/**
 * 获取纯色数组的前10个颜色
 * @returns {Array<Array<string>>} 二维数组
 */
const getSolidColorPredefine = (): Array<Array<string>> => {
  const colors = Object.values(solidColorPredefine).slice(0, 10)
  const result = colors.map((color, index) => [...color, solidColorPredefine.white[index]])
  return result
}

/** 默认面板颜色展示对象 */
export const colorPredefine = {
  /** 纯色 */
  solid: getSolidColorPredefine(),
  /** 渐变色 */
  gradient: gradientColorPredefine,
}

/** 颜色选择器容器类型 */
export enum ColorPickerBoxType {
  /** 弹出面板 */
  PoPupPanel = 1,
  /** 面板 */
  Panel = 2,
}

/** 颜色选择器面板类型 */
export enum ColorPickerPanelType {
  /** 纯色 */
  Solid = 0,
  /** 线性渐变 */
  Linear = 1,
  /** 径向渐变 */
  Radial = 2,
}

/** 收藏本地存储key */
export const HEART_LOCAL = "heart_local_key"
