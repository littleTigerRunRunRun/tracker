import EASING from './easing.js'

let processId = 0
class Tick {
  constructor() {
    this.process = []
    this.activateProcess = []
    this.hash = {}
    this.tickFunc = this.tick.bind(this)
    requestAnimationFrame(this.tickFunc)
  }
  add(func, activate = false) {
    const id = processId++
    this.process.push({
      func,
      activate,
      id
    })
    this.hash[id] = this.process.length - 1
    return id
  }
  setActivate(id, activate) {
    this.process[this.hash[id]].activate = activate
    this.refreshActivateProcess()
  }
  refreshActivateProcess() {
    this.activateProcess = this.process.filter((process) => process.activate)
  }
  tick() {
    const now = Date.now()
    this.activateProcess.map((process) => {
      process.func(now)
    })
    requestAnimationFrame(this.tickFunc)
  }
}
const tick = new Tick()

export class Tween {
  constructor({ target, duration, delay, ease, from, to, setMapFuncs, getMapFuncs, onUpdate, filters = null }) {
    this.tick = tick
    this.target = target
    this.duration = duration
    this.delay = delay
    this.ease = ease || 'linear'
    this._from = from
    this._to = to

    this.setMapFuncs = {}
    this.getMapFuncs = {}
    for (const key in setMapFuncs) {
      this.setMapFuncs[key] = setMapFuncs[key] || this._defaultSetMapFunc
      this.getMapFuncs[key] = getMapFuncs[key] || this._defaultGetMapFunc
    }

    this.onUpdate = onUpdate
    this.filters = filters // onUpdate的轻量化处理

    this.tickId = this.tick.add(this.update.bind(this))
  }
  _defaultSetMapFunc = (key, value) => { this.target[key] = value }
  _defaultGetMapFunc = (key) => this.target[key]
  _activate = false
  set activate(val) {
    if (this._activate === val) return
    this._activate = val
    this.tick.setActivate(this.tickId, val)
  }
  // 自定义执行点什么
  do(func) {
    func()
    return this
  }
  // 设置from，如果在初始化时没有的话
  from(from) {
    if (from) this._from = from
    return this
  }
  get easing() {
    if (typeof this.ease === 'function') return this.ease
    else return EASING[this.ease || 'linear'] || EASING.linear
  }
  // 设置去向但是并不直接开始
  to(to, duration, delay, ease) {
    if (to) this._to = to
    if (duration) this.duration = duration
    if (delay) this.delay = delay
    if (ease) this.ease = ease
    if (!to) {
      console.error('没有正确设置to的值')
      return false
    }
    if (!this._from) {
      const from = {}
      for (const key in this._to) {
        from[key] = (this.getMapFunc[key] || this._defaultGetMapFunc)(key)
      }
      this._from = from
    }
    return this
  }
  // 停上一帧，有时候会需要，比如上一帧设置transition下一帧设置值来触发
  oneFrame() {

  }
  _startTime = 0
  start() {
    this._startTime = Date.now()
    this.activate = true
    return this
  }
  wait(time) {
    return this
  }
  lerp(total) {
    const lerps = {}
    for (const key in this._to) {
      lerps[key] = this.easing(total, this._from[key], this._to[key], this.duration)
      if (!this.onUpdate && !this.filters) { (this.setMapFuncs[key] || this._defaultSetMapFunc)(key, lerps[key]) }
      // 这一步是因为对于某些mvvm对象，tween的差值单位可能变化，但是自己又只能设置一套，这种操作就能在不同单位间切换使用
      if (this.filters) { (this.setMapFuncs[key] || this._defaultSetMapFunc)(key, { value: lerps[key], filter: this.filters[key] || '' }) }
    }
    if (this.onUpdate) this.onUpdate(lerps)
  }
  update(now) {
    const total = now - this._startTime - this.delay
    if (total < 0) return
    if (total > this.duration) {
      this.lerp(this.duration)
      this.activate = false
      if (this.callbackFunc) {
        this.callbackFunc()
      }
    } else this.lerp(total)
  }
  callback(func) {
    this.callbackFunc = func
    return this
  }
}

export class Timeline {
  constructor() {
    this.tweens = []
  }
  add(tween) {
    this.tweens.push(tween)
  }
  play() {
    const all = []
    this.tweens.map((tween) => {
      all.push(new Promise((resolve) => {
        tween.start().callback(() => {
          resolve()
        })
      }))
    })
    return all
  }
}
