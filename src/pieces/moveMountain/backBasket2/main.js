import DS from '../prefab/DeferredScene'
import Material from '../prefab/material'
import { CubeGeometry, PlaneGeometry } from '@luma.gl/engine'
import { Vector3 } from 'math.gl'
// import Skybox from '../prefab/'

const models = [
  {
    geometry: new CubeGeometry(),
    position: [3, 1, 0],
    material: new Material.Default({ baseColor: [1.0, 0.5, 0.31] })
  },
  {
    geometry: new CubeGeometry(),
    position: [-3, 1, 0],
    material: new Material.Default({ baseColor: [0.31, 0.5, 1.0] })
  },
  {
    geometry: new PlaneGeometry({ type: 'x,z', xlen: 20, zlen: 20 }),
    position: [0, 0, 0],
    material: new Material.Default({ baseColor: [1.0, 1.0, 1.0] })
  }
]

const lights = {
  ambient: { color: [1.0, 1.0, 1.0], intensity: 0.4 },
  directional: [
    { color: [1.0, 1.0, 1.0], intensity: 1.0, direction: new Vector3(12.0, 12.0, 0.0) },
    { color: [0.3, 0.6, 0.9], intensity: 0.4, direction: new Vector3(4.0, 1.0, 4.0) },
    { color: [0.9, 0.6, 0.2], intensity: 0.4, direction: new Vector3(2.0, 4.0, -1.0) }
  ]
}

const control = {
  type: 'base', // default is base
  params: {
    damping: 0.1,
    moveEdge: 0.3
  }
}

export default function getScene(props) {
  return new DS({
    env: 'dev',
    props,
    models,
    lights,
    eyesPosition: [-6, 6, 8],
    control,
    framebuffers: [
      // 'depth',
      // 'normals',
      'depth_normals'
    ]
  })
}
