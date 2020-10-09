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

  constructor({ intensity, color }) {
    this._intensity = intensity
    this._color = color
  }
}
