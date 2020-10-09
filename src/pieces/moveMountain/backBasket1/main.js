import Scene from '../prefab/Scene'
import Material from '../prefab/material'
import Light from '../prefab/light'
import { CubeGeometry } from '@luma.gl/engine'
import { Vector3 } from 'math.gl'
// import Skybox from '../prefab/'

const models = [
  {
    geometry: new CubeGeometry(),
    position: [3, 0, 0],
    material: new Material.Default({ baseColor: [1.0, 0.5, 0.31] })
  },
  {
    geometry: new CubeGeometry(),
    position: [-3, 0, 0],
    material: new Material.Default({ baseColor: [1.0, 0.5, 0.31] })
  }
]

const lights = [
  new Light.Directional({ color: [1.0, 1.0, 1.0], direction: new Vector3(1.0, 1.0, 1.0) })
]

const control = {
  type: 'base', // default is base
  params: {
    damping: 0.15,
    moveEdge: 0.3
  }
}

export default function getScene(props) {
  return new Scene({
    props,
    models,
    lights,
    eysPosition: [0, 0, 16],
    control
  })
}
