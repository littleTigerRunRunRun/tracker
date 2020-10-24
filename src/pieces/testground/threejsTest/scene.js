import {
  WebGLRenderer, PerspectiveCamera, Scene, Color, CubeTextureLoader,
  MeshBasicMaterial, MeshLambertMaterial, SphereBufferGeometry, BoxBufferGeometry, Mesh,
  DirectionalLight, AmbientLight
} from '@/lib/three.module.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
import { ShaderPass } from '@/lib/postprocessing/ShaderPass'
import { Vector3 } from 'math.gl'

export default class MainScene {
  constructor({ container, params }) {
    this.container = container
    this.params = params

    this.initScenes()
    this.addSceneThings()
    this.addComposer()
    window.addEventListener('resize', this.onResize)

    this.renderer.compile(this.scene, this.camera)
    const gl = this.renderer.getContext()
    const fragment = this.cube.material.program.fragmentShader
    const vertex = this.cube.material.program.vertexShader
    console.log(gl.getShaderSource(fragment))
    // console.log(this.cube.material.program)

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
    switch (key) {
      case 'focus':
        this.bokehPass.uniforms.focus.value = value
        break
      case 'aperture':
        this.bokehPass.uniforms.aperture.value = value * 0.00001
        break
    }
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
    // this.renderer.setClearColor(new Color(0xFFFFFF))
    this.renderer.autoClear = false
    this.container.appendChild(this.renderer.domElement)

    const aspect = this.width / this.height
    this.camera = new PerspectiveCamera(70, aspect, 1, 2000)
    this.camera.position.set(400, 200, 200)
    this.camera.lookAt(this.scene.position)
  }

  addSceneThings() {
    const cube = new Mesh(
      new BoxBufferGeometry(100, 100, 100),
      new MeshLambertMaterial()
    )
    this.cube = cube
    cube.position.y = 50
    this.scene.add(cube)

    const dl1 = new DirectionalLight(0x0044ff, 1.0)
    dl1.position.set(200, 200, 200)
    this.scene.add(dl1)

    const dl2 = new DirectionalLight(0xff6600, 0.8)
    dl2.position.set(-200, 200, 200)
    this.scene.add(dl2)
  }

  addComposer() {
    // this.composer = new EffectComposer(this.renderer)
    // this.composer.addPass(new RenderPass(this.scene, this.camera))
  }

  update = this.updateFunc.bind(this)
  updateFunc() {
    this.renderer.render(this.scene, this.camera)
    // this.composer.render(0.1)

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}
