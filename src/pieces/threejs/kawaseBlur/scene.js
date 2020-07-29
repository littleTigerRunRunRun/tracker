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
        this.kawaseBlur1.uniforms.radius.value = value
        this.kawaseBlur2.uniforms.radius.value = value * 2
        this.kawaseBlur3.uniforms.radius.value = value * 3
        this.kawaseBlur4.uniforms.radius.value = value * 4
        this.kawaseBlur5.uniforms.radius.value = value * 5
        this.kawaseBlur6.uniforms.radius.value = value * 6
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

    this.kawaseBlur1 = new ShaderPass(KawaseBlurShader)
    this.kawaseBlur1.uniforms.tSize.value = new Vector2(this.width, this.height)
    this.kawaseBlur1.uniforms.radius.value = this.params.radius * 1.0
    this.composer.addPass(this.kawaseBlur1)

    this.kawaseBlur2 = new ShaderPass(KawaseBlurShader)
    this.kawaseBlur2.uniforms.tSize.value = new Vector2(this.width, this.height)
    this.kawaseBlur2.uniforms.radius.value = this.params.radius * 2.0
    this.composer.addPass(this.kawaseBlur2)

    this.kawaseBlur3 = new ShaderPass(KawaseBlurShader)
    this.kawaseBlur3.uniforms.tSize.value = new Vector2(this.width, this.height)
    this.kawaseBlur3.uniforms.radius.value = this.params.radius * 3.0
    this.composer.addPass(this.kawaseBlur3)

    this.kawaseBlur4 = new ShaderPass(KawaseBlurShader)
    this.kawaseBlur4.uniforms.tSize.value = new Vector2(this.width, this.height)
    this.kawaseBlur4.uniforms.radius.value = this.params.radius * 4.0
    this.composer.addPass(this.kawaseBlur4)

    this.kawaseBlur5 = new ShaderPass(KawaseBlurShader)
    this.kawaseBlur5.uniforms.tSize.value = new Vector2(this.width, this.height)
    this.kawaseBlur5.uniforms.radius.value = this.params.radius * 5.0
    this.composer.addPass(this.kawaseBlur5)

    this.kawaseBlur6 = new ShaderPass(KawaseBlurShader)
    this.kawaseBlur6.uniforms.tSize.value = new Vector2(this.width, this.height)
    this.kawaseBlur6.uniforms.radius.value = this.params.radius * 6.0
    this.composer.addPass(this.kawaseBlur6)
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
