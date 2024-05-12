import tinyColor from "tinycolor2"

/**
 * 去除字符串空格
 * @param {string} target 目标字符串
 * @param {"all" | "left" | "right" | "around"} type 去除空格类型
 * @returns {string} 返回处理后的字符串
 */
export function trim(target: string, type: "all" | "left" | "right" | "around" = "all"): string {
  switch (type) {
    case "all":
      return target.replace(/\s/g, "")
    case "left":
      return target.replace(/^\s*/, "")
    case "right":
      return target.replace(/\s*$/, "")
    case "around":
      return target.replace(/(^\s*)|(\s*$)/g, "")
    default:
      return target
  }
}

interface Hex {
  source: "hex"
  hex: string
  a?: number
}
interface RGB extends tinyColor.ColorFormats.RGBA {
  source: "rgb"
}
interface RGBA extends tinyColor.ColorFormats.HSLA {
  source: "rgba"
}
interface HSL extends tinyColor.ColorFormats.HSLA {
  source: "hsl"
}
interface HSVA extends tinyColor.ColorFormats.HSVA {
  source: "hsva"
}

export type colorType = Hex | RGB | RGBA | HSL | HSVA

/** 颜色对象 */
export type colorObj = {
  hex?: string
  hsl?: tinyColor.ColorFormats.HSLA
  hsv?: tinyColor.ColorFormats.HSVA
  rgba?: tinyColor.ColorFormats.RGBA
  hex8?: string
  oldHue?: number
  rgb?: string
  h?: number
  s?: number
  v?: number
  l?: number
  r?: number
  g?: number
  b?: number
  a?: number
  source?: colorType["source"]
}

/**
 * 颜色转对象
 * @param {colorType | string} originColor 颜色
 * @param {number} originAlpha 透明度
 * @returns {colorObj} 返回颜色对象
 */
export const colorToObj = (originColor: colorType | string, originAlpha?: number): colorObj => {
  let color: tinyColor.Instance & { _a?: number }
  let alpha: number | undefined
  if (typeof originColor === "string") {
    color = tinyColor(originColor)
    return {
      hsl: color.toHsl(),
      hex: color.toHexString().toUpperCase(),
      hex8: color.toHex8String().toUpperCase(),
      rgba: color.toRgb(),
      hsv: color.toHsv(),
      oldHue: originAlpha || color.toHsl().h,
      a: color.getAlpha(),
    }
  } else {
    alpha = originColor.a
    switch (originColor.source) {
      case "hex":
        color = tinyColor(originColor.hex)
        break
      default:
        color = tinyColor(originColor)
    }
    if (color && !color._a === undefined && !color._a === null) color.setAlpha(alpha || 1)
    const hsl = color.toHsl()
    const hsv = color.toHsv()
    if (hsl.s === 0) {
      if (originColor.source === "hsl" || originColor.source === "hsva") {
        hsv.h = hsl.h = originColor.h || originAlpha || 0
      } else {
        hsv.h = hsl.h = originAlpha || 0
      }
    }
    return {
      hsl,
      hex: color.toHexString().toUpperCase(),
      hex8: color.toHex8String().toUpperCase(),
      rgba: color.toRgb(),
      hsv,
      oldHue: originColor.source === "hex" || originColor.source === "rgb" ? originAlpha || hsl.h : originColor.h || originAlpha || hsl.h,
      a: originColor.a || color.getAlpha(),
      source: originColor.source,
    }
  }
}
