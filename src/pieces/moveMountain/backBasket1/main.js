import Scene from '../prefab/Scene'
import { CubeGeometry } from '@luma.gl/engine'
// import Skybox from '../prefab/'

const models = [
  {
    geometry: new CubeGeometry(),
    position: [3, 0, 0]
  },
  {
    geometry: new CubeGeometry(),
    position: [-3, 0, 0]
  }
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
    eysPosition: [0, 0, 16],
    control
  })
}
