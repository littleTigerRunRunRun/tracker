import { WebGLRenderer, PerspectiveCamera, Scene, Fog, AmbientLight, Object3D, SphereBufferGeometry, MeshPhongMaterial, Mesh } from '@/lib/three.module.js'

export default class MainScene {
  constructor({ container }) {
    this.container = container

    this.initScenes()
    this.addSceneThings()
    window.addEventListener('resize', this.onResize)
  }

  onResize = this.onResizeFunc.bind(this)
  onResizeFunc() {

  }

  initScenes() {
    console.log(this.container)
    const bound = this.container.getBoundingClientRect()

    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(bound.width, bound.height)
    this.container.appendChild(this.renderer.domElement)

    this.camera = new PerspectiveCamera(70, bound.width, bound.height, 1, 1000)
    this.camera.position.z = 400

    this.scene = new Scene()
    this.scene.fog = new Fog(0x000000, 1, 1000)

    const light = new AmbientLight(0x222222)
    light.position.set(1, 1, 1)
    this.scene.add(light)
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

    const geometry = new SphereBufferGeometry(1, 8, 8)
    const material = new MeshPhongMaterial({ color: 0xffffff, flatShading: true })

    for (let i = 0; i < 10; i++) {
      const mesh = new Mesh(geometry, material)
      mesh.position.set(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random()).normalize()
      mesh.position.multiplyScalar(Math.random() * 400)
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50
      this.main.add(mesh)
    }
  }

  destroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
