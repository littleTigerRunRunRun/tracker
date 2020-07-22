import { Timeline, Tween } from './tween'
import Charactor from './charactor'

// 一个抽象类，它会存储最近的directorId作为指针，并且将自动找寻自己对应的props和charactors
class IdObject {
  constructor({ directorId }) {
    this.directorId = directorId
  }
  get charactors() { return _charactors[this.directorId] }
  get props() { return _props[this.directorId] }
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
    else if (this.value instanceof Array) return this.value[index]
    else return this.value
  }
}

class Action extends IdObject {
  constructor(action) {
    super({ directorId: action.directorId })
    this.desc = action.desc
    // 大部分的action在初始化时是没有charactors到位的
    this.masses = typeof action.charactors === 'string'
    this.timeline = new Timeline()
    this.addClips(action.actionClips)
  }
  // getProp(name) {
  //   if (this.props[name]) return this.props[name]
  //   console.error(`找不到名为${name}的道具(prop)`)
  // }
  getPropValue(name, index) {
    // 提供一种全新的功能，支持prop.childProp,childProp2的方式抽出部分属性组成一个新的对象
    if (name.indexOf && name.indexOf('.') > -1) {
      name = name.split('.')
      const childs = name[1].split(',')
      const propValue = this.getPropValue(name[0], index)
      const result = {}
      for (const key of childs) {
        result[key] = propValue[key]
      }
      return result
    } else {
      if (typeof name === 'string') {
        if (this.props[name]) return this.props[name].getValue(index)
        console.error(`找不到名为${name}的道具(prop)`)
      }
      return name
    }
  }
  // 将可能包含了prop的对象数组中的prop取值并完成assign
  assignObjects(array, temporaryData, index) {
    let assignObj = {}
    array.map((prop) => {
      // console.log(prop, temporaryData)
      if (temporaryData && temporaryData[prop]) {
        assignObj = Object.assign(assignObj, temporaryData[prop])
      } else assignObj = Object.assign(assignObj, this.getPropValue(prop, index))
    })
    return assignObj
  }
  addClips(clips) {
    this.clips = []
    for (const clip of clips) {
      this.addClip(clip)
    }
  }
  addClip(clip) {
    const newClip = {}
    newClip.delay = clip.delay
    newClip.duration = clip.duration
    newClip.repeat = clip.repeat || 1
    newClip.from = clip.from
    newClip.to = clip.to
    newClip.update = clip.update
    newClip.filters = clip.filters
    newClip.ease = clip.ease
    this.clips.push(newClip)
    return newClip
  }
  editClip(index, key, value) {
    this.clips[index][key] = value
  }
  setMassesCharactors({ target, gather }) {
    this.relativeCharactors = target
    this.relativeGather = gather
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
  play(params, temporaryData) {
    const rc = this.relativeCharactors // 快速通道
    const gather = params.gather || this.relativeGather
    if (this.timeline.tweens.length === 0) {
      for (const clip of this.clips) {
        if (rc instanceof Charactor) {
          // 群演动画
          for (let i = 0; i < rc.length; i++) {
            if (!gather.includes(i)) continue
            const target = rc.getTarget(i)
            const tween = new Tween({
              groupIndex: i,
              from: this.assignObjects(clip.from, temporaryData, i),
              to: this.assignObjects(clip.to, temporaryData, i),
              repeat: this.getPropValue(clip.repeat),
              duration: this.getPropValue(clip.duration, i),
              delay: this.getPropValue(clip.delay, i) + (params.delay || 0),
              target,
              ease: clip.ease,
              onUpdate: clip.update,
              filters: clip.filters
            })
            this.timeline.add(tween)
          }
        } else {
          // console.log(clip.filters)
          if (Object.keys(rc).length === 1) {
            // 单对象动画
            const target = rc[0].getTarget()
            const tween = new Tween({
              from: this.assignObjects(clip.from, temporaryData),
              to: this.assignObjects(clip.to, temporaryData),
              repeat: this.getPropValue(clip.repeat),
              duration: this.getPropValue(clip.duration),
              delay: this.getPropValue(clip.delay) + (params.delay || 0),
              target,
              ease: clip.ease,
              onUpdate: clip.update,
              filters: clip.filters
            })
            this.timeline.add(tween)
            // how to set delay
          } else {
            // 多对象动画
            for (let i = 0; i < rc.length; i++) {
              if (gather && !gather.includes(i)) continue
              const target = rc[i].getTarget()
              const tween = new Tween({
                groupIndex: i,
                from: this.assignObjects(clip.from, temporaryData, i),
                to: this.assignObjects(clip.to, temporaryData, i),
                repeat: this.getPropValue(clip.repeat, i),
                duration: this.getPropValue(clip.duration, i),
                delay: this.getPropValue(clip.delay, i) + (params.delay || 0),
                target,
                ease: clip.ease,
                onUpdate: clip.update,
                filters: clip.filters
              })
              this.timeline.add(tween)
            }
          }
        }
      }
      return this.timeline.play(gather)
    } else return this.timeline.play(gather)
  }
  timelineControl(code) {
    if (this.timeline) this.timeline.timelineControl(code)
  }
  onComplete() {
    console.log('anime complete')
  }
}

class Scene extends IdObject {
  constructor({ name, actions, directorId }) {
    super({ directorId })
    this.name = name
    this.registerActions(actions)
  }

  fetchGather(charactors) {
    let gather = []
    let target = null

    if (charactors.indexOf('.') > -1) {
      const split = charactors.split('.')
      target = this.charactors[split[0]]
      gather = split[1].split(',').map((item) => parseInt(item))
    } else if (charactors.indexOf('-') > -1) {
      const split = charactors.split('-')
      target = this.charactors[split[0]]
      const filter = split[1].split(',').map((item) => parseInt(item))
      for (let i = 0; i < target.length; i++) {
        if (!filter.includes(i)) gather.push(i)
      }
    } else {
      target = this.charactors[charactors]
      for (let i = 0; i < target.length; i++) {
        gather.push(i)
      }
    }

    return {
      target,
      gather
    }
  }

  registerActions(actions) {
    this.actions = []
    for (const action of actions) {
      this.addAction(action)
    }
  }

  addAction(action) {
    const sceneAction = new Action(Object.assign({ directorId: this.directorId }, action))
    let charactors
    // 群演动画
    if (typeof action.charactors === 'string') {
      const massesCharactor = this.fetchGather(action.charactors)
      sceneAction.setMassesCharactors(massesCharactor)
    } else {
      charactors = action.charactors.map((name) => {
        return this.charactors[name]
      })
      sceneAction.setCharactors(charactors)
    }
    this.actions.push(sceneAction)
    return sceneAction
  }

  getAction(index) {
    return this.actions[index]
  }

  play(params, temporaryData) {
    let all = []
    for (const action of this.actions) {
      all = all.concat(action.play(params, temporaryData))
    }
    return all
  }

  timelineControl(code) {
    for (const action of this.actions) action.timelineControl(code)
  }
}

let directorLastestId = 0 // 全局有多个剧本的情况下，用这个id区分演员池和道具池
const _charactors = {} // 演员池
const _props = {} // 道具集，道具包含了数据和通过序列生成数据的工具函数
// 剧组
export default class Director {
  constructor({ storyborad }) {
    this.directorId = ++directorLastestId
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
    this.charactors[name].reset()
    // console.log(this.charactors[name])
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
        type: this.getPropType(value),
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
    const scene = new Scene({ directorId: this.directorId, name, actions })

    this._scenes[name] = scene
  }
  getScene(name) {
    return this._scenes[name]
  }
  playScenes(scenes, temporaryData) {
    if (typeof scenes === 'string') return Promise.all(this._scenes[scenes].play({}, temporaryData))
    else if (scenes instanceof Array) {
      let all = []
      for (const scene of scenes) {
        all = all.concat(this._scenes[scene.name].play(scene, temporaryData))
      }
      return Promise.all(all)
    }
    // return this._scenes[name].play()
  }
  destroy() {
    // 销毁
  }
}
