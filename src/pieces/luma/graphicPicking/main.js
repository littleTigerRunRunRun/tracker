import { ShaderPass, Loop } from '@/pieces/luma/common/pass'
import { constantValue } from '@/pieces/luma/common/utils'
import InstancingTrianglePass from './InstancingTrianglePass'
import GraphicPickingPass from './GraphicPickingPass'

export default function setCanvas(canvas) {
  const loop = new Loop({
    canvas,
    autoUpdate: true,
    stages: [
      [
        {
          pass: InstancingTrianglePass
        },
        {
          pass: GraphicPickingPass
        }
      ]
    ]
  })

  loop.addRenderTask()

  loop.setCursor = function(pos) {
    if (this.pipe) this.pipe.pools.pos = pos
  }

  return loop
}
