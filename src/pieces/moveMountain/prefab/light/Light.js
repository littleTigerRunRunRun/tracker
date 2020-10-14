export default class Light {
  _intensity = 0
  get intensity() { return this._intensity }
  set intensity(val) {
    this._intensity = val
  }

  _color = [1.0, 1.0, 1.0]
  get color() { return this._color }
  set color(val) {
    this._color = val
  }

  // 外部要使用时直接获取数据的get方法
  get light() {
    return {
      color: this.color,
      intensity: this.intensity
    }
  }

  constructor({ intensity, color, type }) {
    this.type = type || 'base'
    this._intensity = intensity
    this._color = color
  }
}
