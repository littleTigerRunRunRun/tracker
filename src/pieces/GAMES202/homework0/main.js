import * as THREE from '../../../lib/three.module'
import { OrbitControls } from '../../../lib/OrbitControls'
import { PointLight } from '../common/lights/PointLight'
import { WebGLRenderer } from '../common/renderers/WebGLRenderer'
import { loadOBJ } from '../common/loads/loadOBJ'
// import { OBJLoader } from '../../../lib/loaders/OBJLoader'
import * as dat from 'dat.gui'

let canvas
// 设置相机
const cameraPosition = [-20, 180, 250]
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2])

function setSize() {
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width
  canvas.height = height
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

export function main(c) {
  canvas = c
  // 设置canvas和gl
  setSize()
  window.onresize = setSize
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.')
    return
  }

  // set camera control
  const cameraControls = new OrbitControls(camera, canvas)
  cameraControls.enableZoom = true
  cameraControls.enableRotate = true
  cameraControls.enablePan = true
  cameraControls.rotateSpeed = 0.3
  cameraControls.zoomSpeed = 1.0
  cameraControls.panSpeed = 2.0
  cameraControls.target.set(0, 1, 0)

  // 设置灯光
  const pointLight = new PointLight(250, [1, 1, 1])

  // renderer
  const renderer = new WebGLRenderer(gl, camera)
  renderer.addLight(pointLight)
  loadOBJ(renderer, '/public/model/mary/', 'Marry')

  // gui
  var guiParams = {
    modelTransX: 0,
    modelTransY: 0,
    modelTransZ: 0,
    modelScaleX: 52,
    modelScaleY: 52,
    modelScaleZ: 52
  }
  const gui = new dat.gui.GUI()
  const panelModel = gui.addFolder('Model properties')
  const panelModelTrans = panelModel.addFolder('Translation')
  const panelModelScale = panelModel.addFolder('Scale')
  panelModelTrans.add(guiParams, 'modelTransX').name('X')
  panelModelTrans.add(guiParams, 'modelTransY').name('Y')
  panelModelTrans.add(guiParams, 'modelTransZ').name('Z')
  panelModelScale.add(guiParams, 'modelScaleX').name('X')
  panelModelScale.add(guiParams, 'modelScaleY').name('Y')
  panelModelScale.add(guiParams, 'modelScaleZ').name('Z')
  panelModel.open()
  panelModelTrans.open()
  panelModelScale.open()

  function mainLoop(now) {
    cameraControls.update()

    renderer.render(guiParams)
    requestAnimationFrame(mainLoop)
  }
  requestAnimationFrame(mainLoop)
}
