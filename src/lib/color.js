// 假设的格式为:
// 0xffffff #ffffff #fff hsl(100, 100, 10) rgb() rbga() { r: g: b: a: }
// hsl暂时还没支持到
export default class GLColor {
  _r = 0
  get r() { return this._r }
  set r(r) {
    this._r = Math.round(r)
    this._r16 = this._r.toString(16)
    if (this._r16.length === 1) this._r16 = '0' + this._r16
  }

  _g = 0
  get g() { return this._g }
  set g(g) {
    this._g = Math.round(g)
    this._g16 = this._g.toString(16)
    if (this._g16.length === 1) this._g16 = '0' + this._g16
  }

  _b = 0
  get b() { return this._b }
  set b(b) {
    this._b = Math.round(b)
    this._b16 = this._b.toString(16)
    if (this._b16.length === 1) this._b16 = '0' + this._b16
  }

  a = 1

  constructor(color) {
    this.decomposeColor(color)
  }

  decomposeColor(color) {
    if (color) {
      // 16进制颜色
      if (typeof color === 'number') {
        let color16string = color.toString(16)
        while (color16string.length < 6) {
          color16string = '0' + color16string
        }
        this.deal16String(color16string)
      } else if (typeof color === 'string') {
        if (color.indexOf('hsl') > -1) {
          color = color.replace(/\s*/g, '') // 去空格
          color = color.match(/\((.+?)\)/)[1] // 匹配括号内的内容
          color = color.split(',') // 分离成数组
          this.dealHSLString(parseInt(color[0]), parseInt(color[1]), parseInt(color[2]))
        } else if (color.indexOf('0x') > -1) {
          this.deal16String(color.replace('0x', ''))
        } else if (color.indexOf('#') > -1) {
          color = color.replace('#', '')
          if (color.length === 3) color = color.split('').map((c) => { return c + c }).join('')
          this.deal16String(color)
        } else if (color.indexOf('rgb') > -1) {
          color = color.replace(/\s*/g, '') // 去空格
          color = color.match(/\((.+?)\)/)[1] // 匹配括号内的内容
          color = color.split(',') // 分离成数组
          this.dealRGBA(color)
        }
      } else if (color instanceof Array) {
        this.r = color[0] || 0
        this.g = color[1] || 0
        this.b = color[2] || 0
        this.a = color[3] || 0
      } else if (typeof color === 'object') {
        this.r = color.r || color.red || 0
        this.g = color.g || color.green || 0
        this.b = color.b || color.black || 0
        this.a = color.a || color.alpha || color.opacity || 0
      }
    }
  }

  set(color) {
    this._h = this._s = this._l = null
    this.decomposeColor(color)
  }

  getHue2RGB(v1, v2, vh) {
    if (vh < 0) vh += 1
    if (vh > 1) vh -= 1
    if (vh < 1 / 6) return v1 + (v2 - v1) * 6 * vh
    if (vh < 1 / 2) return v2
    if (vh < 2 / 3) return v1 + (v2 - v1) * (2 / 3 - vh) * 6
    return v1
  }

  dealHSLString(h, s, l) {
    h = h % 360
    if (h <= 0) h += 360
    if (h) {
      // 归一化
      h = h / 360
      s = s / 100
      l = l / 100

      this._h = h
      this._s = s
      this._l = l
    } else {
      h = this._h
      s = this._s
      l = this._l
    }

    let v1
    let v2

    if (s === 0) {
      this.r = l * 255
      this.g = l * 255
      this.b = l * 255
    } else {
      if (l < 0.5) v2 = l * (1 + s)
      else v2 = (l + s) - l * s

      v1 = 2 * l - v2

      this.r = 255 * this.getHue2RGB(v1, v2, h + 1 / 3)
      this.g = 255 * this.getHue2RGB(v1, v2, h)
      this.b = 255 * this.getHue2RGB(v1, v2, h - 1 / 3)
    }
  }

  deal16String(str) {
    this.r = parseInt('0x' + str.slice(0, 2))
    this.g = parseInt('0x' + str.slice(2, 4))
    this.b = parseInt('0x' + str.slice(4, 6))
  }

  dealRGBA(rgba) {
    this.r = parseInt(rgba[0])
    this.g = parseInt(rgba[1])
    this.b = parseInt(rgba[2])
    if (rgba[3] !== undefined) this.a = rgba[3]
  }

  // 6种格式输出
  get16Num() {
    return parseInt(`0x${this._r16}${this._g16}${this._b16}`)
  }

  get16String() {
    return `#${this._r16}${this._g16}${this._b16}`
  }

  getRGBA() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }

  getRGB() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  getHSL() {
    if (!this._h) {
      const r = this._r / 255
      const g = this._g / 255
      const b = this._b / 255
      const min = Math.min(r, Math.min(g, b))
      const max = Math.max(r, Math.max(g, b))
      const del = max - min

      // lightness
      const l = (max + min) / 2
      let h
      let s
      if (del === 0) {
        h = 0
        s = 0
      } else {
        if (l < 0.5) s = del / (max + min)
        else s = del / (2 - max - min)

        const delR = ((max - r) / 6 + del / 2) / del
        const delG = ((max - g) / 6 + del / 2) / del
        const delB = ((max - b) / 6 + del / 2) / del

        if (r === max) h = delB - delG
        else if (g === max) h = 1 / 3 + delR - delB
        else h = 2 / 3 + delG - delR

        if (h < 0) h += 1
        if (h > 1) h -= 1
      }

      this._h = h
      this._s = s
      this._l = l
    }
    return `hsl(${Math.round(this._h * 360)}, ${Math.round(this._s * 100)}%, ${Math.round(this._l * 100)}%)`
  }

  getHSLObject() {
    if (!this._h) this.getHSL()
    return {
      h: this._h,
      s: this._s,
      l: this._l
    }
  }

  getObject() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    }
  }

  get normalize3() {
    return this.getNormalize(3)
  }

  get normalize4() {
    return this.getNormalize(4)
  }

  getNormalize(channleNum = 4) {
    return [this.r / 255, this.g / 255, this.b / 255, parseFloat(this.a)].slice(0, channleNum)
  }

  // 这里的familyColor的含义，是颜色族群，即获取一个Hue值的不同亮度饱和度和亮度的同族颜色
  getFamilyColor(s, l) {
    const familyColor = new GLColor()
    familyColor._h = this._h
    familyColor._s = s
    familyColor._l = l
    familyColor.dealHSLString()
    return familyColor
  }
}

const lerpColor = new GLColor()
GLColor.lerp = function(GLColor1, GLColor2, t) {
  lerpColor.set({
    r: GLColor1.r + (GLColor2.r - GLColor1.r) * t,
    g: GLColor1.g + (GLColor2.g - GLColor1.g) * t,
    b: GLColor1.b + (GLColor2.b - GLColor1.b) * t,
    a: GLColor1.a + (GLColor2.a - GLColor1.a) * t
  })
  return lerpColor
}

function clamp(value) {
  return Math.min(Math.max(0, value), 1)
}

const addHSLColor = new GLColor()
GLColor.addHSL = function(color, HSLChange) {
  addHSLColor.set(color)
  addHSLColor.getHSL()
  addHSLColor._h = clamp(addHSLColor._h + HSLChange.h)
  addHSLColor._s = clamp(addHSLColor._s + HSLChange.s)
  addHSLColor._l = clamp(addHSLColor._l + HSLChange.l)
  addHSLColor.dealHSLString()
  return addHSLColor.get16String()
}
