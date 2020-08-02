import {
  WebGLRenderer, PerspectiveCamera, Scene, Color, CubeTextureLoader,
  MeshBasicMaterial, SphereBufferGeometry, Mesh,
  DirectionalLight, AmbientLight
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
    const urls = [
      '/public/img/texture/posx.jpg', '/public/img/texture/negx.jpg',
      '/public/img/texture/posy.jpg', '/public/img/texture/negy.jpg',
      '/public/img/texture/posz.jpg', '/public/img/texture/negz.jpg'
    ]
    const textureCube = new CubeTextureLoader().load(urls)

    const materialParams = { color: 0xff1100, envMap: textureCube }
    const cubeMaterial = new MeshBasicMaterial(materialParams)

    const singleMaterial = false
    let zmaterial
    const materials = []
    const objects = []

    if (singleMaterial) zmaterial = [cubeMaterial]

    const geo = new SphereBufferGeometry(1, 20, 10)

    const xLength = 5
    for (let i = 0; i < xLength; i++) {
      let mesh
      if (singleMaterial) {
        mesh = new Mesh(geo, zmaterial)
      } else {
        mesh = new Mesh(geo, new MeshBasicMaterial(materialParams))
        materials[0] = mesh.material
      }
      mesh.position.set(120 * (i - (xLength - 1) / 2), 0, 0)
      const s = 60
      mesh.scale.set(s, s, s)
      mesh.matrixAutoUpdate = false
      mesh.updateMatrix()

      this.scene.add(mesh)
      objects.push(mesh)
    }

    const lightPointGeo = new SphereBufferGeometry(10, 10, 10)
    for (let i = 0; i < 10; i++) {
      const mesh = new Mesh(lightPointGeo, new MeshBasicMaterial({ color: 0xffffff }))
      mesh.position.set(-500, 0, 100 * (i - 4.5))

      this.scene.add(mesh)
    }
  }

  addComposer() {
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    this.bokehPass = new BokehPass(this.scene, this.camera, {
      focus: 1.0,
      aperture: 0.00001, // 光圈直径
      maxblur: 0.01,
      width: this.width,
      height: this.height
    })
    this.composer.addPass(this.bokehPass)
  }

  update = this.updateFunc.bind(this)
  updateFunc() {
    // this.renderer.render(this.scene, this.camera)
    this.composer.render(0.1)

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}
