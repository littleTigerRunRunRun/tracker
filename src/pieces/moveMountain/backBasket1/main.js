import Scene from '../prefab/Scene'
// import Skybox from '../prefab/'

const models = [
  {

  }
]

const control = {
  type: 'base', // default is base
  params: {
    damping: 0.16,
    moveEdge: 0.6
  }
}

export default function getScene(props) {
  return new Scene({
    props,
    models,
    control
  })
}
