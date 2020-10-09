import Light from './Light'
import { Vector3 } from 'math.gl'

export default class DirectionalLight extends Light {
  _direction = new Vector3(1, 1, 1)
  get direction() { return this._direction }
  set direction(dir) {
    this._direction = dir
  }

  constructor(params) {
    super(params)

    this.direction = params.direction
  }
}
