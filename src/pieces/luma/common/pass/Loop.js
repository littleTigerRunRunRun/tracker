import { AnimationLoop } from '@luma.gl/engine'
// import { setParameters } from '@luma.gl/gltools'
import { Pipe } from './Pipe'

const nullRenderTask = {
  before: () => {},
  after: () => {}
}

export class Loop {
  constructor({ canvas, stages, autoUpdate = false, initTasks }) {
    this.drawer = canvas || document.createElement('canvas')
    // this.showDrawer()
    this.loop = null
    this.pipe = null
    this.initTasks = initTasks || []
    this.renderTasks = []
    this.gl = null
    this.autoUpdate = autoUpdate

    this.initLoop({ stages })
  }

  showDrawer() {
    this.drawer.style.position = 'fixed'
    this.drawer.style.left = 0
    this.drawer.style.top = 0
    document.body.appendChild(this.drawer)
  }

  initLoop({ stages }) {
    // 启动loop
    this.loop = new AnimationLoop({
      onInitialize: ({ gl }) => {
        this.gl = gl

        // setParameters(gl, {
        //   // blend: true,
        //   blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE]
        // })

        this.pipe = new Pipe({
          gl,
          autoUpdate: this.autoUpdate,
          // textures: {
          //   t_geo: '/public/t_circle.png'
          // },
          stages
        })
        this.pipe.pools.canvas = this.drawer

        for (const task of this.initTasks) task.call(this, gl)

        return {}
      },
      onRender: ({ gl, time }) => {
        if (this.renderTasks.length === 0 && this.autoUpdate) {
          this.pipe.next({ time })
          this.pipe.clear()
        } else {
          const tasks = [].concat(this.renderTasks)
          this.renderTasks.splice(0, this.renderTasks.length)
          for (const task of tasks) {
            task.before({ gl, pipe: this.pipe })
            this.pipe.next({ time })
            task.after({ gl, pipe: this.pipe })
            this.pipe.clear()
          }
        }
      },
      autoResizeViewport: false
      // useDevicePixels: true
    })

    this.loop.start({
      webgl2: true,
      canvas: this.drawer,
      antialias: true,
      width: 400,
      height: 400,
      // premultipliedAlpha: false,
      preserveDrawingBuffer: true
    })
  }

  addRenderTask(renderTask = nullRenderTask) {
    if (this.renderTasks.indexOf(renderTask) > -1) return
    this.renderTasks.push(renderTask)
  }

  destroy() {
    this.loop.delete()
  }
}
