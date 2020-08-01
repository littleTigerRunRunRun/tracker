import {
  WebGLRenderer, PerspectiveCamera, Scene, Color, CubeTextureLoader,
  MeshBasicMaterial, SphereBufferGeometry, Mesh
} from '@/lib/three.module.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
import { ShaderPass } from '@/lib/postprocessing/ShaderPass'
import { BokehPass } from '@/lib/postprocessing/BokehPass.js'

export default class MainScene {
  constructor({ container, params }) {
    this.container = container
    this.params = params

    this.initScenes()
    this.addSceneThings()
    this.addComposer()
    window.addEventListener('resize', this.onResize)

    this.update()
  }

  onResize = this.onResizeFunc.bind(this)
  onResizeFunc() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.camera.aspect = bound.width / bound.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(bound.width, bound.height)
    this.composer.setSize(bound.width, bound.height)
  }

  //
  refresh(container) {
    this.container.removeChild(this.renderer.domElement)
    this.container = container
    this.container.appendChild(this.renderer.domElement)
  }

  changeParams(key, value) {

  }

  initScenes() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.scene = new Scene()

    this.renderer = new WebGLRenderer({
      preserveDrawingBuffer: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(bound.width, bound.height)
    this.renderer.setClearColor(new Color(0xFFFFFF))
    this.renderer.autoClear = false
    this.container.appendChild(this.renderer.domElement)

    const aspect = this.width / this.height
    this.camera = new PerspectiveCamera(-aspect, aspect, 1, -1, 0, 1)
  }

  addSceneThings() {
    const urls = [
      '/public/img/texture/dark-s_nx.jpg', '/public/img/texture/dark-s_nx.jpg',
      '/public/img/texture/dark-s_ny.jpg', '/public/img/texture/dark-s_ny.jpg',
      '/public/img/texture/dark-s_nz.jpg', '/public/img/texture/dark-s_nz.jpg'
    ]
    const textureCube = new CubeTextureLoader().load(urls)

    const materialParams = { color: 0xff1100, envMap: textureCube }
    const cubeMaterial = new MeshBasicMaterial(materialParams)

    const singleMaterial = false
    let zmaterial
    const materials = []
    const objects = []

    if (singleMaterial) zmaterial = [cubeMaterial]

    const geo = new SphereBufferGeometry(1, 10, 10)

    let mesh

    if (singleMaterial) {
      mesh = new Mesh(geo, zmaterial)
    } else {
      mesh = new Mesh(geo, new MeshBasicMaterial(materialParams))
      materials[0] = mesh.material
    }

    mesh.position.set(0, 0, 0)
    const s = 20
    mesh.scale.set(s, s, s)
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()

    this.scene.add(mesh)
    objects.push(mesh)
  }

  addComposer() {
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    this.bokehPass = new BokehPass(scene, camera, {
      focus: 1.0,
      aperture: 0.025 // 光圈直径
    })
  }

  update = this.updateFunc.bind(this)
  updateFunc() {
    this.renderer.render(this.scene, this.camera)
    // this.composer.render()

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}
