import GSAP from 'gsap'
const Timeline = GSAP.core.Timeline

// 剧组
export default class Director {
  constructor({ storyborad }) {
    this.plan(storyborad)
  }

  // 导演拿到剧本后，确定角色，配置道具，准备镜头内容
  plan({ charactors, props, scenes }) {
    this.listCharactors(charactors) // 被列出的角色，这些角色将会被检验完整性，如果开拍时角色还未到位，将无法开拍
    this.listProps(props)
    this.listScenes(scenes)
  }

  // 演员
  _charactors = {} // 演员池
  // list是在留出演员的职位，不一定立刻到位
  listCharactors(charactors) {
    for (const charactor of charactors) {
      this._charactors[charactor.name] = {
        name: charactor.name,
        masses: charactor.masses || false,
        length: charactor.length || 1,
        target: charactor.target || null
      }
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
    if (!this._charactors[name]) {
      this._charactors[name] = {
        name: name,
        masses: (target instanceof Array),
        length: target.length || 1,
        target,
        temporary: true // 这说明这是一个临时演员
      }
    } else {
      // 换角的标记
      if (this._charactors[name.target]) this._charactors[name].change = true
      else this._charactors[name].change = false
      // 演员就位
      this._charactors[name].target = target
      if (target instanceof Array) {
        this._charactors[name].masses = true
        this._charactors[name].length = target.length
      }
    }
  }

  // 道具
  _props = {} // 道具集，道具包含了数据和通过序列生成数据的工具函数
  // list是留出道具位，不一定要赋值
  listProps(props) {
    for (const prop of props) {
      this._props[prop.name] = {
        name: prop.name,
        type: this.getPropType(prop.value || prop.default), // 目前的情况只有这两种
        value: prop.value || prop.default || null
      }
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
      this.addProps(name, props[name])
    }
  }
  addProp(name, value) {
    if (this._props[name]) this._props[name].value = value
    else {
      this._props[name] = {
        name,
        value,
        type: getPropType(value),
        temporary: true // 临时标记
      }
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
    const scene = { actions: {}}
    scene.timeline = new Timeline()

    for (const action of actions) {
      console.log(action)
      const sceneAction = {}

      if (typeof action.charactors === 'string') {

      } else {

      }
    }

    this._scenes[name] = scene
  }
}
