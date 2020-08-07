import {
  WebGLRenderer, PerspectiveCamera, OrthographicCamera, Scene, Color, AxisHelper, Fog, Vector2, TextureLoader,
  AmbientLight, DirectionalLight, SpotLight,
  Object3D, BoxGeometry, SphereBufferGeometry, PlaneBufferGeometry, MeshPhongMaterial, MeshLambertMaterial, MeshBasicMaterial, Mesh
} from '@/lib/three.module.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
import { ShaderPass } from '@/lib/postprocessing/ShaderPass'
// import { DotScreenShader } from '@/lib/shaders/DotScreenShader'
// import { RGBShiftShader } from '@/lib/shaders/RGBShiftShader'
import { KawaseBlurShader } from './index'

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
    switch (key) {
      case 'image':
        this.material.map = new TextureLoader().load(value)
        break
      case 'radius':
        for (const blur of this.blurs) blur.uniforms.radius.value = value * 2
        break
      case 'stage':
        for (let i = 0; i < this.blurs.length; i++) this.blurs[i].enabled = !!(i < value)
        break
    }
  }

  addSceneThings() {
    this.main = new Object3D()
    this.scene.add(this.main)

    const texture = new TextureLoader().load(this.params.image)
    const geometry = new PlaneBufferGeometry(2 * this.width / this.height, 2)
    this.material = new MeshBasicMaterial({
      map: texture
    })

    const mesh = new Mesh(geometry, this.material)
    // mesh.rotation.x = Math.PI * -0.5

    this.main.add(mesh)
  }

  addComposer() {
    // 将画布内的内容绘制到RenderPass这个VBO里面，然后传递个下一个后处理
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    console.log(this.params.radius)

    this.blurs = []
    for (let i = 0; i < 8; i++) {
      const kawaseBlur = new ShaderPass(KawaseBlurShader)
      kawaseBlur.uniforms.tSize.value = new Vector2(this.width, this.height)
      kawaseBlur.uniforms.radius.value = this.params.radius * 1.0
      this.composer.addPass(kawaseBlur)
      if (i > 0) kawaseBlur.enabled = false
      this.blurs.push(kawaseBlur)
    }
  }

  update = this.updateFunc.bind(this)
  updateFunc() {
    // this.renderer.render(this.scene, this.camera)
    this.composer.render()

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}
