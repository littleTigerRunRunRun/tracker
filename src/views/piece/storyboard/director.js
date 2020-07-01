import { Timeline, Tween } from './tween'

// 一个抽象类，它会存储最近的directorId作为指针，并且将自动找寻自己对应的props和charactors
class IdObject {
  constructor() {
    this.directorId = directorLastestId
  }
  get charactors() { return _charactors[this.directorId] }
  get props() { return _props[this.directorId] }
}

class Charactor {
  constructor(charactor) {
    this.name = charactor.name
    this.length = charactor.length || 1
    this.target = charactor.target || null
    this.masses = charactor.masses || false
    this.temporary = charactor.temporary || false
    this.engrave(charactor.engrave)
  }
  // engrave on one's mind铭记
  engrave(engrave) {

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

  }
}

class Prop {
  constructor(prop) {
    this.name = prop.name
    this.type = prop.type
    this.value = prop.value || null
    this.temporary = prop.temporary || false
  }
  getValue(index) {
    if (!this.value) {
      console.error(`名为${this.name}的道具未就位`)
      return
    }
    if (this.type === 'function') return this.value(index)
    else return this.value
  }
}

class Action extends IdObject {
  constructor(action) {
    super()
    this.desc = action.desc
    this.charactorsName = action.charactors
    this.masses = typeof action.charactors === 'string'
    this.timeline = new Timeline()
    this.addClips(action.actionClips)
  }
  getProp(name) {
    if (this.props[name]) return this.props[name]
    console.error(`找不到名为${name}的道具(prop)`)
  }
  getPropValue(name, index) {
    if (typeof name === 'string') {
      if (this.props[name]) return this.props[name].getValue(index)
      console.error(`找不到名为${name}的道具(prop)`)
    }
    return name
  }
  // 将可能包含了prop的对象数组中的prop取值并完成assign
  assignObjects(array, index) {
    let assignObj = {}
    const valueGotArray = array.map((prop) => {
      assignObj = Object.assign(assignObj, this.getPropValue(prop, index))
    })
    return assignObj
  }
  addClips(clips) {
    this.clips = []
    for (const clip of clips) {
      const newClip = {}
      newClip.delay = clip.delay
      newClip.duration = clip.duration
      newClip.from = clip.from
      newClip.to = clip.to
      newClip.update = clip.update
      newClip.ease = clip.ease
      this.clips.push(newClip)
    }
  }
  setCharactors(charactors) {
    // 为了不与charactors的getter重名
    if (this.masses) this.relativeCharactors = charactors
    else {
      this.relativeCharactors = []
      this.relativeCharactorsHash = {}
      for (const charactor of charactors) {
        this.relativeCharactors.push(charactor)
        this.relativeCharactorsHash[charactor.name] = this.relativeCharactors.length - 1
      }
    }
  }
  play(params) {
    const rc = this.relativeCharactors // 快速通道
    for (const clip of this.clips) {
      if (rc instanceof Charactor) {
        // 群演动画
        for (let i = 0; i < rc.length; i++) {
          const target = rc.getTarget(i)
          const tween = new Tween({
            from: this.assignObjects(clip.from, i),
            to: this.assignObjects(clip.to, i),
            duration: this.getPropValue(clip.duration, i),
            delay: this.getPropValue(clip.delay, i) + (params.delay || 0),
            target,
            ease: clip.ease,
            onUpdate: clip.update
          })
          this.timeline.add(tween)
        }
      } else {
        if (Object.keys(rc).length === 1) {
          // 单对象动画
          const target = rc[0].getTarget()
          const tween = new Tween({
            from: this.assignObjects(clip.from),
            to: this.assignObjects(clip.to),
            duration: this.getPropValue(clip.duration),
            delay: this.getPropValue(clip.delay) + (params.delay || 0),
            target,
            ease: clip.ease,
            onUpdate: clip.update
          })
          this.timeline.add(tween)
          // how to set delay
        } else {
          // 多对象动画
          console.log('multitarget anime')
        }
      }
    }
    return this.timeline.play()
  }
  onComplete() {
    console.log('anime complete')
  }
}

class Scene extends IdObject {
  constructor({ name, actions }) {
    super()
    this.name = name
    this.registerActions(actions)
  }

  registerActions(actions) {
    this.actions = []
    for (const action of actions) {
      const sceneAction = new Action(action)
      let charactors
      if (typeof action.charactors === 'string') {
        charactors = this.charactors[action.charactors]
      } else {
        charactors = action.charactors.map((name) => {
          return this.charactors[name]
        })
      }
      sceneAction.setCharactors(charactors)
      this.actions.push(sceneAction)
    }
  }

  play(params) {
    let all = []
    for (const action of this.actions) {
      all = all.concat(action.play(params))
    }
    return all
  }
}

let directorLastestId = 0
const _charactors = {} // 演员池
const _props = {} // 道具集，道具包含了数据和通过序列生成数据的工具函数
// 剧组
export default class Director {
  constructor({ storyborad }) {
    directorLastestId = Date.now()
    this.directorId = directorLastestId
    _charactors[directorLastestId] = {}
    _props[directorLastestId] = {}
    this.plan(storyborad)
  }

  // 导演拿到剧本后，确定角色，配置道具，准备镜头内容
  plan({ charactors, props, scenes }) {
    this.listCharactors(charactors) // 被列出的角色，这些角色将会被检验完整性，如果开拍时角色还未到位，将无法开拍
    this.listProps(props)
    this.listScenes(scenes)
  }

  // 演员
  get charactors() { return _charactors[this.directorId] }
  // list是在留出演员的职位，不一定立刻到位
  listCharactors(charactors) {
    for (const charactor of charactors) {
      this.charactors[charactor.name] = new Charactor(charactor)
    }
  }
  // 批量添加角色
  addCharactors(charactors) {
    for (const name in charactors) {
      this.addCharactor(name, charactors[name])
    }
  }
  // 添加角色
  addCharactor(name, target) {
    if (!this.charactors[name]) {
      this.charactors[name] = new Charactor({
        name,
        masses: (target instanceof Array),
        length: target.length || 1,
        target,
        temporary: true // 这说明这是一个临时演员
      })
    } else this.charactors[name].change({ target })
  }
  resetCharator(name) {

  }

  // 道具
  get props() { return _props[this.directorId] }
  // list是留出道具位，不一定要赋值
  listProps(props) {
    for (const prop of props) {
      this.props[prop.name] = new Prop({
        name: prop.name,
        type: this.getPropType(prop.value || prop.default), // 目前的情况只有这两种
        value: prop.value || prop.default || null
      })
    }
  }
  getPropType(value) {
    if (!value) return 'object'
    if (typeof value === 'function') return 'function'
    if (value instanceof Array) return 'array'
    return 'object'
  }
  addProps(props) {
    for (const name in props) {
      this.addProp(name, props[name])
    }
  }
  addProp(name, value) {
    if (this.props[name]) this.props[name].value = value
    else {
      this.props[name] = new Prop({
        name,
        value,
        type: getPropType(value),
        temporary: true // 临时标记
      })
    }
  }

  // 场景，一些就action组成了一个场景scene
  _scenes = {}
  listScenes(scenes) {
    for (const sceneName in scenes) {
      this.registerScene(sceneName, scenes[sceneName])
    }
  }
  // 为什么这里使用的register而不是add来形容呢，这里的行为更像是手枪打开保险的程度。
  // action里面的具体动画，都会在这一步注册成tweenline里的内容
  registerScene(name, actions) {
    const scene = new Scene({ name, actions })

    this._scenes[name] = scene
  }
  playScenes(scenes) {
    if (typeof scenes === 'string') return Promise.all(this._scenes[scenes].play({}))
    else if (scenes instanceof Array) {
      let all = []
      for (const scene of scenes) {
        all = all.concat(this._scenes[scene.name].play(scene))
      }
      return Promise.all(all)
    }
    // return this._scenes[name].play()
  }
}
