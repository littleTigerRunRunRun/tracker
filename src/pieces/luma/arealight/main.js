import { Loop } from '@/pieces/luma/common/pass'
import createBuffer from '@/pieces/moveMountain/prefab/buffer/index'
import getPass1 from './pass1'

export default function setCanvas(canvas, props) {
  const loop = new Loop({
    canvas,
    autoUpdate: true,
    initTasks: [
      function (gl) {
        const framebuffer = createBuffer('standard', gl)
        this.pipe.pools.framebuffer = framebuffer
      }
    ],
    stages: [
      [
        {
          pass: getPass1(props)
        }
      ]
    ]
  })

  loop.addRenderTask()

  return loop
}
