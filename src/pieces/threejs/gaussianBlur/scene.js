import {
  WebGLRenderer, PerspectiveCamera, Scene, Color, AxisHelper, Fog,
  AmbientLight, DirectionalLight, SpotLight,
  Object3D, BoxGeometry, SphereBufferGeometry, PlaneBufferGeometry, MeshPhongMaterial, MeshLambertMaterial, MeshBasicMaterial, Mesh
} from '@/lib/three.module.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
import { ShaderPass } from '@/lib/postprocessing/ShaderPass'
import { DotScreenShader } from '@/lib/shaders/DotScreenShader'
import { RGBShiftShader } from '@/lib/shaders/RGBShiftShader'

export default class MainScene {
  constructor({ container }) {
    this.container = container

    this.initScenes()
    this.addSceneThings()
    this.addComposer()
    window.addEventListener('resize', this.onResize)

    this.update()
  }

  onResize = this.onResizeFunc.bind(this)
  onResizeFunc() {
    this.refresh
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  initScenes() {
    const bound = this.container.getBoundingClientRect()

    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(bound.width, bound.height)
    this.renderer.setClearColor(new Color(0xEEEEEE))
    this.container.appendChild(this.renderer.domElement)

    this.scene = new Scene()
    this.scene.fog = new Fog(0x000000, 1, 1000)

    this.camera = new PerspectiveCamera(60, bound.width / bound.height, 0.1, 1000)
    this.camera.position.set(-400, 300, 500)
    this.camera.lookAt(this.scene.position)

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

  addSceneThings() {
    this.main = new Object3D()
    this.scene.add(this.main)

    const geometry = new BoxGeometry()
    const material = new MeshPhongMaterial({ color: 0xffffff })

    for (let i = 0; i < 10; i++) {
      const mesh = new Mesh(geometry, material)
      mesh.position.set(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random()).normalize()
      mesh.position.multiplyScalar(Math.random() * 200)
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50
      this.main.add(mesh)
    }
  }

  addComposer() {
    // 将画布内的内容绘制到RenderPass这个VBO里面，然后传递个下一个后处理
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    // 点阵后处理
    const dotScreen = new ShaderPass(DotScreenShader)
    dotScreen.uniforms.scale.value = 4
    this.composer.addPass(dotScreen)
  }

  update = this.updateFunc.bind(this)
  updateFunc() {
    this.main.rotation.y += 0.005
    // this.renderer.render(this.scene, this.camera)
    this.composer.render()

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}
