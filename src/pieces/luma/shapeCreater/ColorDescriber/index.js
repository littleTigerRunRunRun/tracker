import { RectProcessModel } from '@/pieces/luma/common/models/RectProcessModel'
import { clear } from '@luma.gl/webgl'

// 对一个[width / height]的区域，提供着色方程和混合方式的参数，width / height来自
export class ColorDescriber {
  constructor(layers) {
    this.layers = layers
  }

  render(gl) {
    const stopsUniformsName = 'u_linear_colorStops'
    const stops = [
      { offset: 0, color: [1, 0, 0, 1] },
      { offset: 1, color: [1, 1, 1, 1] }
    ]
    const stopsUniforms = {}
    stops.map((stop, index) => {
      for (const key in stop) {
        stopsUniforms[`${stopsUniformsName}[${index}].${key}`] = stop[key]
      }
    })
    console.log(stopsUniforms)

    this.model = new RectProcessModel(gl, {
      is2: true,
      fs: `#version 300 es
        in vec2 v_uv;

        struct ColorStop {
          vec4 color;
          float offset;
        };

        struct LinearGradient {
          vec2 startPoint;
          vec2 endPoint;
        };

        uniform vec2 u_linear_start_point;
        uniform vec2 u_linear_end_point;
        uniform ColorStop[${stops.length}] u_linear_colorStops;

        out vec4 fragColor;
        
        void main() {
          vec2 uv = vec2(v_uv.x, f1 - v_uv.y);
          vec2 vecse = u_linear_end_point - u_linear_start_point;
          float v = dot((uv - u_linear_start_point), vecse) / pow(length(vecse), f2);
          fragColor = vec4(f0);

          if (v < fhalf) {
            for (int i = i0; i < ${stops.length - 1}; i = i + i1) {
              if (v > u_linear_colorStops[i].offset && v < u_linear_colorStops[i + i1].offset) {
                float t = (u_linear_colorStops[i + i1].offset - v) / (u_linear_colorStops[i + i1].offset - u_linear_colorStops[i].offset);
                #if (LINEAR_INTERPOLATE_TYPE == 0) // 0 means linear
                #elif (LINEAR_INTERPOLATE_TYPE == 1) // 1 means exp
                t = pow(t, 1.66);
                #elif (LINEAR_INTERPOLATE_TYPE == 2) // 2 means log
                t = pow(t, 0.6);
                #endif
                fragColor += u_linear_colorStops[i].color * t + u_linear_colorStops[i + 1].color * (f1 - t);
                i = ${stops.length - 1};
              }
            }
          } else {
            for (int i = ${stops.length - 1}; i > i0; i = i - i1) {
              if (v < u_linear_colorStops[i].offset && v > u_linear_colorStops[i - i1].offset) {
                float t = (v - u_linear_colorStops[i - i1].offset) / (u_linear_colorStops[i].offset - u_linear_colorStops[i - i1].offset);
                #if (LINEAR_INTERPOLATE_TYPE == 0) // 0 means linear
                t = f1 - t;
                #elif (LINEAR_INTERPOLATE_TYPE == 1) // 1 means exp
                t = pow((f1 - t), 1.66);
                #elif (LINEAR_INTERPOLATE_TYPE == 2) // 2 means log
                t = pow((f1 - t), 0.6);
                #endif
                fragColor += u_linear_colorStops[i].color * (f1 - t) + u_linear_colorStops[i - i1].color * t;
                i = i0;
              }
            }
          }
        }
      `,
      defines: {
        LINEAR_INTERPOLATE_TYPE: this.layers[0].interpolate
      },
      uniforms: Object.assign(stopsUniforms, {
        u_linear_start_point: [0.5, 0.0],
        u_linear_end_point: [0.5, 1.0]
      })
    })
    // clear(gl, { color: [0, 0, 0, 0], depth: false, stencil: false })
    this.model.draw()
  }
}

// 渐变着色层
// linear: {
//   direction: 180, // 这条线性渐变的角度
//   limited: false, // 有限的，也就是说不往周边扩展
//   stops: [
//     { color: rgba(255, 0, 0, 0.8), offset: 0.2 },
//     { colro: rgba(255, 255, 255, 1), offset: 1 }
//   ]
// }
function linear(linears) {

}
