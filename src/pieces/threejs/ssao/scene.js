import {
  WebGLRenderer, WebGLRenderTarget, PerspectiveCamera, OrthographicCamera, Scene, Color, AxisHelper, Fog, Vector2, TextureLoader,
  RGBADepthPacking, NoBlending, NearestFilter,
  AmbientLight, DirectionalLight, SpotLight,
  Object3D, BoxGeometry, SphereBufferGeometry, PlaneBufferGeometry, MeshPhongMaterial, MeshLambertMaterial, MeshBasicMaterial, MeshDepthMaterial, ShaderMaterial, Mesh
} from '@/lib/three.module.js'
import { MapControls } from '@/lib/OrbitControls.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { Pass } from '@/lib/postprocessing/Pass.js'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
// import { ShaderPass } from '@/lib/postprocessing/ShaderPass'
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

    // this.material.uniforms.u_resolution.value = new Vector2(bound.width, bound.height)

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

    this.renderTargetDepth = new WebGLRenderTarget(this.width, this.height, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      stencilBuffer: false
    })
    this.renderTargetDepth.texture.name = 'ssao.depth'

    background.uniforms['tDepth'].value = this.renderTargetDepth.texture
    this.materialShader = new ShaderMaterial(background)
    this.fsQuad = new Pass.FullScreenQuad(this.materialShader)

    this.materialDepth = new MeshDepthMaterial()
    // this.materialDepth.depthPacking = RGBADepthPacking
    this.materialDepth.blending = NoBlending

    this.scene = new Scene()
    // this.scene.fog = new Fog(0x000000, 1, 1000)

    const aspect = this.width / this.height
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 2000)
    this.camera.position.set(200, 200, 300)
    this.camera.lookAt(this.scene.position)

    this.scene.add(new AmbientLight(0x222222))

    const light = new DirectionalLight(0xffffff)
    light.position.set(10, 10, 10)
    this.scene.add(light)

    // const axes = new AxisHelper(20)
    // this.scene.add(axes)

    this.controls = new MapControls(this.camera, this.renderer.domElement)

    this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05

    this.controls.screenSpacePanning = false

    this.controls.minDistance = 1
    this.controls.maxDistance = 10000

    this.controls.maxPolarAngle = Math.PI / 2
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

    const planeGeo = new PlaneBufferGeometry(1000, 1000, 1, 1)
    const planeMat = new MeshBasicMaterial({ color: 0x999999 })
    const planeMesh = new Mesh(planeGeo, planeMat)
    planeMesh.rotation.x = Math.PI * -0.5
    this.main.add(planeMesh)

    const boxs = [
      {
        size: [20, 150, 200],
        position: [0, 75, 90],
        color: 0xbbbbbb
      },
      {
        size: [200, 100, 20],
        position: [110, 50, 0],
        color: 0xbbbbbb
      },
      {
        size: [40, 80, 40],
        position: [80, 40, 80],
        color: 0xdddddd
      }
    ]

    for (const box of boxs) {
      const boxGeo = new BoxGeometry(...box.size)
      const boxMat = new MeshBasicMaterial({ color: box.color }) // new ShaderMaterial(background)
      const mesh = new Mesh(boxGeo, boxMat)
      mesh.position.set(...box.position)

      this.main.add(mesh)
    }
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
    this.scene.overrideMaterial = this.materialDepth
    this.renderer.setRenderTarget(this.renderTargetDepth)
    this.renderer.setClearColor(0xffffff)
    this.renderer.setClearAlpha(1.0)
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)

    this.renderer.setRenderTarget(null)
    this.scene.overrideMaterial = null
    this.renderer.setClearColor(0x000000)
    // this.renderer.setClearAlpha(1.0)
    this.renderer.clear()
    this.fsQuad.render(this.renderer)

    // this.composer.render()

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}
