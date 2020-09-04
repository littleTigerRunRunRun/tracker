import {
  WebGLRenderer, PerspectiveCamera, OrthographicCamera, Scene, Color, AxisHelper, Fog, Vector2, TextureLoader,
  AmbientLight, DirectionalLight, SpotLight,
  Object3D, BoxGeometry, SphereBufferGeometry, PlaneBufferGeometry, MeshPhongMaterial, MeshLambertMaterial, MeshBasicMaterial, ShaderMaterial, Mesh
} from '@/lib/three.module.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
import { ShaderPass } from '@/lib/postprocessing/ShaderPass'
import background from './background'

export default class MainScene {
  constructor({ container, params }) {
    this.container = container
    this.params = params

    this.initScenes()
    this.addSceneThings()
    this.addComposer()
    window.addEventListener('resize', this.onResize)

    this._startTime = Date.now()
    this.update()
  }

  onResize = this.onResizeFunc.bind(this)
  onResizeFunc() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.camera.aspect = bound.width / bound.height
    this.camera.updateProjectionMatrix()

    this.material.uniforms.u_resolution.value = new Vector2(bound.width, bound.height)

    this.renderer.setSize(bound.width, bound.height)
    // this.composer.setSize(bound.width, bound.height)
  }

  initScenes() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.renderer = new WebGLRenderer({
      preserveDrawingBuffer: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(bound.width, bound.height)
    this.renderer.setClearColor(new Color(0xFFFFFF))
    this.container.appendChild(this.renderer.domElement)

    this.scene = new Scene()
    this.scene.fog = new Fog(0x000000, 1, 1000)

    const aspect = this.width / this.height
    this.camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0, 1)
    // this.camera.position.set(0, 20, 0)
    // this.camera.lookAt(this.scene.position)

    this.scene.add(new AmbientLight(0x222222))

    const light = new DirectionalLight(0xffffff)
    light.position.set(10, 10, 10)
    this.scene.add(light)

    // const axes = new AxisHelper(20)
    // this.scene.add(axes)
  }

  //
  refresh(container) {
    this.container.removeChild(this.renderer.domElement)
    this.container = container
    this.container.appendChild(this.renderer.domElement)
  }

  changeParams(key, value) {
  }

  addSceneThings() {
    this.main = new Object3D()
    this.scene.add(this.main)

    const geometry = new PlaneBufferGeometry(2 * this.width / this.height, 2)
    background.uniforms.u_resolution.value = new Vector2(this.width, this.height)
    this.material = new ShaderMaterial(background)
    // console.log(this.material)

    const mesh = new Mesh(geometry, this.material)
    // mesh.rotation.x = Math.PI * -0.5

    this.main.add(mesh)
  }

  addComposer() {
    // 将画布内的内容绘制到RenderPass这个VBO里面，然后传递个下一个后处理
    // this.composer = new EffectComposer(this.renderer)
    // this.composer.addPass(new RenderPass(this.scene, this.camera))

    // const boxBlurHorizontal = new ShaderPass(BoxBlurShader)
    // this.blurs.push(boxBlurHorizontal)
  }

  update = this.updateFunc.bind(this)
  updateFunc() {
    this.renderer.render(this.scene, this.camera)
    // this.composer.render()
    this.material.uniforms.u_time.value = (Date.now() - this._startTime)

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}
