// 劫持dom
// 我们导入的target如果是dom类型的，往往是style
const DEFAULT_FILTERS = {
  px: (value) => `${value}px`,
  percent: (value) => `${value}%`,
  rotate: (value) => `rotate(${value}deg)`
}
const DEFAULT_PROP = {
  width: 'px',
  height: 'px',
  left: 'px',
  top: 'px',
  right: 'px',
  bottom: 'px',
  rotate: 'rotate'
}
const KEY_MAP = {
  rotate: 'transform'
}
function hijackDom(target) {
  return new Proxy({ target }, {
    get: function({ target }, propKey) {
      return target.style[propKey] || target[propKey] || ''
    },
    set: function({ target }, propKey, value) {
      const filter = value.filter || DEFAULT_PROP[propKey] || '' // 默认的filter
      const targetProp = KEY_MAP[propKey] || propKey
      // console.log(propKey, value.value || value)
      if (value.filter !== undefined) {
        // console.log(filter, targetProp, DEFAULT_FILTERS[filter], value)
        if (typeof filter === 'function') target.style[targetProp] = filter(value.value)
        else if (DEFAULT_FILTERS[filter]) target.style[targetProp] = DEFAULT_FILTERS[filter](value.value)
        else console.error(`不存在的filter类型，请写自定义函数作为filter`)
      } else if (filter) {
        if (value === '') target.style[targetProp] = ''
        else target.style[targetProp] = DEFAULT_FILTERS[filter](value)
      } else target.style[targetProp] = value
      return true
    }
  })
}

export default class Charactor {
  constructor(charactor) {
    this.name = charactor.name
    this.length = charactor.length || 1
    this.masses = charactor.masses || false
    this.temporary = charactor.temporary || false

    // 根据类型劫持
    this.type = charactor.type || ''
    if (charactor.target) this.hijack(charactor)
    // 根据设定的值存储，不过是否可以更加智能一些？
    if (charactor.engrave) this.setEngrave(charactor.engrave)
  }
  // engrave on one's mind铭记
  setEngrave(engrave) {
    this.engrave = { keys: engrave, value: {}}
    for (const key of engrave) { this.engrave.value[key] = '' }
  }
  hijack() {
    switch (this.type) {
      case 'dom': {
        if (this.target instanceof Array) {
          this.target = this.target.map((target) => {
            return hijackDom(target)
          })
        } else this.target = hijackDom(this.target)
        break
      }
      // 无需劫持，这种思考就是认为认定target是一个易于操作的mvvm对象
    }
  }
  // 更换演员对象
  change({ target }) {
    this._changed = true
    this.target = target
    // 群演
    if (target instanceof Array) {
      this.masses = true
      this.length = target.length
    }
    this.hijack()
  }
  getTarget(index) {
    if (!this.target) {
      console.error(`名为${this.name}的演员未就位`)
      return
    }
    if (this.target instanceof Array) return this.target[index]
    return this.target
  }
  reset() {
    for (const key of this.engrave.keys) {
      this.target[key] = ''
    }
  }
}
