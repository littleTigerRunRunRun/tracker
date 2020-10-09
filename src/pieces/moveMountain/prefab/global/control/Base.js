// Base control
// mousewheel view direction move in or out
// left-hold and move horizontally: bearing with the world y axis current
// left-hold and move vertically: pitch with the world xz face
// right-hold and move vertically: move toward and forward
// right-hold and move horizontally: move left and right
// left-right-all-hold move vertically top and down
// left-right-all-hold move horizontally left and right
import { Matrix4, Vector2, Vector3 } from 'math.gl'
import { commonAtan, clamp } from '../utils'

// left = 1
// wheel = 2
// right = 3
// so left + right  1 means left holding  3 means right holding  4 means all holding
const holdMode = {
  0: () => {},
  1: ({ eye, center, viewMatrix, viewMatrixData, sensitivity, range, delt }) => {
    viewMatrixData.pitch += delt.y * (sensitivity.leftY || 1)
    if (range.leftY) viewMatrixData.pitch = clamp(viewMatrixData.pitch, ...range.leftY)

    viewMatrixData.bearing -= delt.x * (sensitivity.leftX || 1)
    if (range.leftX) viewMatrixData.bearing = clamp(viewMatrixData.bearing, ...range.leftX)
  },
  3: ({ eye, center, viewMatrix, viewMatrixData, sensitivity, range, delt }) => {
    const direction = new Vector3(viewMatrixData.eye[0] - viewMatrixData.center[0], viewMatrixData.eye[1] - viewMatrixData.center[1], viewMatrixData.eye[2] - viewMatrixData.center[2])
    const vertical = new Vector3(direction.x, 0, direction.z).normalize()
    const horizontal = direction.cross(new Vector3(0, 1, 0)).normalize()

    const deltx = delt.x * (sensitivity.rightX || 1) * viewMatrixData.length * 0.2
    const deltz = delt.y * (sensitivity.rightY || 1) * viewMatrixData.length * 0.2
    viewMatrixData.translate[0] += deltx * horizontal.x - deltz * vertical.x
    viewMatrixData.translate[1] += deltx * horizontal.y - deltz * vertical.y
    viewMatrixData.translate[2] += deltx * horizontal.z - deltz * vertical.z
  },
  4: ({ eye, center, viewMatrix, viewMatrixData, sensitivity, range, delt }) => {
    const direction = new Vector3(viewMatrixData.eye[0] - viewMatrixData.center[0], viewMatrixData.eye[1] - viewMatrixData.center[1], viewMatrixData.eye[2] - viewMatrixData.center[2])
    const vertical = new Vector3(0, 1, 0)
    const horizontal = direction.cross(new Vector3(0, 1, 0)).normalize()

    const deltx = delt.x * (sensitivity.rightX || 1) * viewMatrixData.length * 0.2
    const delty = delt.y * (sensitivity.rightY || 1) * viewMatrixData.length * 0.2
    viewMatrixData.translate[0] += deltx * horizontal.x + delty * vertical.x
    viewMatrixData.translate[1] += deltx * horizontal.y + delty * vertical.y
    viewMatrixData.translate[2] += deltx * horizontal.z + delty * vertical.z
  }
}

const DEFAULT_BASE_CONTROL = {
  damping: 0.15,
  moveEdge: 0.3,
  sensitivity: {
    leftX: 1,
    leftY: 0.5
  },
  range: {
    leftY: [0.1, Math.PI * 0.5]
  }
}

export default class BaseControl {
  constructor(params = DEFAULT_BASE_CONTROL) {
    const { damping, moveEdge, sensitivity = DEFAULT_BASE_CONTROL.sensitivity, range = DEFAULT_BASE_CONTROL.range } = params

    this.damping = damping
    this.moveEdge = moveEdge
    this.sensitivity = sensitivity
    this.range = range
  }

  bind(target) {
    this.target = target
    target.addEventListener('mousedown', this.onMouseStart)
    // target.addEventListener('mouseout', this.onMouseEnd)
    target.addEventListener('mousemove', this.onMouseMove)
    target.addEventListener('contextmenu', this.onContextMenu)
    target.addEventListener('mousewheel', this.onMouseWheel)
    target.addEventListener('DOMMouseScroll', this.onMouseWheel)
    document.body.addEventListener('mouseup', this.onMouseEnd)
  }
  // target = [0, 0, 0]
  setEye({ eye, center }) {
    this.eye = [].concat(eye)
    this.center = [].concat(center)
    this.viewMatrix = new Matrix4().lookAt({ eye, center })
    this.viewMatrixData.length = Math.hypot(...eye)
    this.viewMatrixData.pitch = commonAtan(Math.hypot(eye[0], eye[2]), eye[1])
    this.viewMatrixData.bearing = commonAtan(eye[2], eye[0])
    this.viewMatrixData.translate = [0, 0, 0]
    this.viewMatrixData.eye = [].concat(eye)
    this.viewMatrixData.center = [].concat(center)
  }

  resetViewMatrix() {
    const viewMatrixData = this.viewMatrixData

    viewMatrixData.eye = [
      Math.sin(viewMatrixData.bearing) * Math.cos(viewMatrixData.pitch) * viewMatrixData.length + viewMatrixData.translate[0],
      Math.sin(viewMatrixData.pitch) * viewMatrixData.length + viewMatrixData.translate[1],
      Math.cos(viewMatrixData.bearing) * Math.cos(viewMatrixData.pitch) * viewMatrixData.length + viewMatrixData.translate[2]
    ]
    viewMatrixData.center = [
      this.center[0] + viewMatrixData.translate[0],
      this.center[1] + viewMatrixData.translate[1],
      this.center[2] + viewMatrixData.translate[2]
    ]
    this.viewMatrix.lookAt({
      eye: viewMatrixData.eye,
      center: viewMatrixData.center
    })
  }

  leftHolding = 0
  rightHolding = 0
  moving = false
  lastVec = new Vector2()
  // event.which 1 left 2 wheel 3 right
  onMouseStart = (event) => {
    event.preventDefault()

    if (event.which === 1) this.leftHolding = 1
    if (event.which === 3) this.rightHolding = 3
    this.lastVec.set(event.pageX, event.pageY)
    this.moving = true
  }

  onMouseMove = (event) => {
    event.preventDefault()

    if (this.moving) {
      this.force.add(new Vector2(event.pageX - this.lastVec.x, event.pageY - this.lastVec.y))
      this.lastVec.set(event.pageX, event.pageY)
    }
  }

  onMouseEnd = (event) => {
    event.preventDefault()

    if (event.which === 1) this.leftHolding = 0
    if (event.which === 3) this.rightHolding = 0
    this.moving = false
  }

  onMouseWheel = (event) => {
    event.preventDefault()

    const delta = event.deltaY * 0.01 || event.detail * 0.333
    this.viewMatrixData.length += delta * (this.sensitivity.wheel || 1)
    this.resetViewMatrix()
  }

  onContextMenu = (event) => {
    event.preventDefault()
  }

  // 这里的移动我们用一个有阻滞力的模型，鼠标位移并不直接线性等于结果，而是会给一个加力，而阻滞力会不断消耗功使其停下
  // 摩擦因子 * 速度 = 摩擦力
  // 所以加力造成的加速回和摩擦力在某一个位置达到一个平衡
  // f = ma
  // 另一方面，从静止到移动，还要克服的是比滑动摩擦力更大的静摩擦力，这里我们认为速度小于某个值就无法移动起来
  viewMatrix = null
  viewMatrixData = {}
  acceleration = new Vector2()
  velocity = new Vector2()
  force = new Vector2()
  lastType = 0
  tick = (delt) => {
    if (this.velocity.x === 0 && this.velocity.y === 0 && !this.moving) return

    const ax = this.force.x - this.velocity.x * this.damping // / this.mess 本来应该有这个mess但是被简化了
    const ay = this.force.y - this.velocity.y * this.damping
    this.velocity.add([ax, ay])

    if (Math.abs(this.velocity.x) < this.moveEdge) this.velocity.x = 0 // 物体克服静摩擦力所需要的最小速度，哈这个其实是不对的，但是简化成了这样一个模型
    if (Math.abs(this.velocity.y) < this.moveEdge) this.velocity.y = 0

    // (this.viewMatrix)
    if (this.lastType !== this.leftHolding + this.rightHolding && this.leftHolding + this.rightHolding) this.lastType = this.leftHolding + this.rightHolding
    holdMode[this.lastType]({
      eye: this.eye,
      center: this.center,
      viewMatrix: this.viewMatrix,
      viewMatrixData: this.viewMatrixData,
      delt: this.velocity.clone().multiplyScalar(delt * 0.00003),
      sensitivity: this.sensitivity,
      range: this.range
    })
    this.resetViewMatrix()
    this.force.set(0, 0)
  }

  destroy() {
    this.target.removeEventListener('mousedown', this.onMouseStart)
    // this.target.removeEventListener('mouseout', this.onMouseEnd)
    this.target.removeEventListener('mousemove', this.onMouseMove)
    this.target.removeEventListener('contextmenu', this.onContextMenu)
    this.target.removeEventListener('DOMMouseScroll', this.onMouseWheel)
    document.body.removeEventListener('mouseup', this.onMouseEnd)
    this.target = null
  }
}
