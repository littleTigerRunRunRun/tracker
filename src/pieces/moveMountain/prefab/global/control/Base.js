// Base control
// mousewheel view direction move in or out
// left-hold and move horizontally: bearing with the world y axis current
// left-hold and move vertically: pitch with the world xz face
// right-hold and move vertically: move toward and forward
// right-hold and move horizontally: move left and right
// left-right-all-hold move vertically top and down
// left-right-all-hold move horizontally left and right
import { Matrix4, Vector2 } from 'math.gl'

const vec1 = new Vector2(1, 2)
const vec2 = new Vector2(2, 3)
console.log(vec1)

const holdMode = {
  left: () => {

  },
  right: () => {

  },
  both: () => {

  }
}

export default class BaseControl {
  constructor({ damping = 0.6, moveEdge = 0.2 }) {
    console.log(damping, moveEdge)
    this.damping = damping
    this.moveEdge = moveEdge
  }

  bind(target) {
    this.target = target
    target.addEventListener('mousedown', this.onMouseStart)
    target.addEventListener('mouseout', this.onMouseEnd)
    target.addEventListener('mousemove', this.onMouseMove)
    document.body.addEventListener('mouseup', this.onMouseEnd)
  }

  setEye(eye, target = [0, 0, 0]) {

  }

  leftHolding = 0
  rightHolding = 0
  moving = false
  lastVec = new Vector2()
  // event.which 1 left 2 wheel 3 right
  onMouseStart = (event) => {
    if (event.which === 1) this.leftHolding = 1
    if (event.which === 3) this.rightHolding = 3
    this.lastVec.set(event.pageX, event.pageY)
    this.moving = true
  }

  onMouseMove = (event) => {
    if (this.moving) {
      this.force.add(new Vector2(event.pageX - this.lastVec.x, event.pageY - this.lastVec.y))
      this.lastVec.set(event.pageX, event.pageY)
    }
  }

  onMouseEnd = (event) => {
    if (event.which === 1) this.leftHolding = 0
    if (event.which === 3) this.rightHolding = 0
    this.moving = false
  }

  // 这里的移动我们用一个有阻滞力的模型，鼠标位移并不直接线性等于结果，而是会给一个加力，而阻滞力会不断消耗功使其停下
  // 摩擦因子 * 速度 = 摩擦力
  // 所以加力造成的加速回和摩擦力在某一个位置达到一个平衡
  // f = ma
  // 另一方面，从静止到移动，还要克服的是比滑动摩擦力更大的静摩擦力，这里我们认为速度小于某个值就无法移动起来
  viewMatrix = new Matrix4()
  acceleration = new Vector2()
  velocity = new Vector2()
  force = new Vector2()
  position = new Vector2()
  tick = (delt) => {
    // console.log(delt)
    const ax = this.force.x - this.velocity.x * this.damping // / this.mess 本来应该有这个mess但是被简化了
    const ay = this.force.y - this.velocity.y * this.damping
    this.velocity.add([ax, ay])

    if (Math.abs(this.velocity.x) < this.moveEdge) this.velocity.x = 0 // 物体克服静摩擦力所需要的最小速度，哈这个其实是不对的，但是简化成了这样一个模型
    if (Math.abs(this.velocity.y) < this.moveEdge) this.velocity.y = 0

    this.position.add(this.velocity.clone().multiplyScalar(delt) * 0.001)
    // this.holdMode(this.viewMatrix)
    this.force.set(0, 0)
  }

  destroy() {
    this.target.removeEventListener('mousedown', this.onMouseStart)
    this.target.removeEventListener('mouseout', this.onMouseEnd)
    this.target.removeEventListener('mousemove', this.onMouseMove)
    document.body.removeEventListener('mouseup', this.onMouseEnd)
    this.target = null
  }
}
