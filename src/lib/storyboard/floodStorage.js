import { Tween } from './tween'

class FloodAttr {
  constructor({ target, key, duration, delay, speed, ease }) {
    this.target = target
    this.key = key
    this.duration = duration
    this.delay = delay
    this.speed = speed
    this.ease = ease
    this.tween = new Tween({ target, delay, duration: duration || 1000, ease })
  }
  refreshTween() {
  }
  getValue() {
    return this.target[this.key]
  }
  setValue(newValue) {
    this.tween.stop()

    const from = {}
    from[this.key] = this.target[this.key]
    const to = {}
    to[this.key] = newValue
    if (this.speed) this.tween.setDuration(Math.abs(newValue - this.target[this.key]) / this.speed * 1000)

    return new Promise((resolve) => {
      this.tween.from(from).to(to).start().callback(() => {
        resolve()
      })
    })
  }
  destroy() {
    this.tween.destroy()
  }
}

export default class FloodStorage {
  constructor(target, keys) {
    this.target = target

    this.addKeys(keys)
  }

  _attrs = {}
  addKeys(keys) {
    for (const obj of keys) {
      const { key, speed, duration, delay = 0, ease = 'linear' } = obj
      this._attrs[key] = new FloodAttr({ target: this.target, key, speed, duration, delay, ease })
      const hijack = {}
      hijack[key] = {
        set: (newValue) => {
          this._attrs[key].setValue(newValue)
        },
        get: () => {
          return this._attrs[key].getValue()
        }
      }
      Object.defineProperties(this, hijack)
    }
  }

  setValue(obj) {
    const array = []
    for (const key in obj) {
      array.push(this._attrs[key].setValue(obj[key]))
    }
    return Promise.all(array)
  }

  destroy() {
    for (const key in this._attrs) {
      this._attrs[key].destroy()
    }
  }
}
