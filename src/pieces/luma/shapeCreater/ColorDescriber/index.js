import { RectProcessModel } from '@/pieces/luma/common/models/RectProcessModel'
import createColorBuffer from '@/pieces/moveMountain/prefab/buffer/ColorBuffer'
import { clear } from '@luma.gl/webgl'

const LINEAR_UNIFORMS_NAME = 'u_linearGradients'
const RADIUS_UNIFORMS_NAME = 'u_radiusGradients'
const CONIC_UNIFORMS_NAME = 'u_conicGradients'

// 对一个[width / height]的区域，提供着色方程和混合方式的参数，width / height来自
export class ColorDescriber {
  constructor(layers, params) {
    this.layers = layers

    this.compileLayers()
    this.params = Object.assign({
      linearInterpolate: 1,
      radiusInterpolate: 0,
      base: [0, 0, 0, 0]
    }, params)
  }

  compileLayers() {
    this.linearIndex = 0
    this.linearGradientsUniforms = {}

    this.radiusIndex = 0
    this.radiusGradientsUniforms = {}

    this.conicIndex = 0
    this.conicGradientsUniforms = {}

    this.layers.map((layer) => {
      switch (layer.type) {
        case 'linear': {
          this.linearGradientsUniforms[`${LINEAR_UNIFORMS_NAME}[${this.linearIndex}].startPoint`] = layer.start.point || [0, 0]
          this.linearGradientsUniforms[`${LINEAR_UNIFORMS_NAME}[${this.linearIndex}].endPoint`] = layer.end.point || [1, 1]
          this.linearGradientsUniforms[`${LINEAR_UNIFORMS_NAME}[${this.linearIndex}].startColor`] = layer.start.color || [0, 0, 0, 1]
          this.linearGradientsUniforms[`${LINEAR_UNIFORMS_NAME}[${this.linearIndex}].endColor`] = layer.end.color || [1, 1, 1, 1]
          this.linearGradientsUniforms[`${LINEAR_UNIFORMS_NAME}[${this.linearIndex}].limited`] = layer.limited ? 1 : 0
          this.linearIndex++
          break
        }
        case 'radius': {
          this.radiusGradientsUniforms[`${RADIUS_UNIFORMS_NAME}[${this.radiusIndex}].center`] = layer.center || [0.5, 0.5]
          this.radiusGradientsUniforms[`${RADIUS_UNIFORMS_NAME}[${this.radiusIndex}].innerRadius`] = layer.inner.radius || 0
          this.radiusGradientsUniforms[`${RADIUS_UNIFORMS_NAME}[${this.radiusIndex}].innerColor`] = layer.inner.color || [1, 1, 1, 1]
          this.radiusGradientsUniforms[`${RADIUS_UNIFORMS_NAME}[${this.radiusIndex}].outerRadius`] = layer.outer.radius || 0.7072
          this.radiusGradientsUniforms[`${RADIUS_UNIFORMS_NAME}[${this.radiusIndex}].outerColor`] = layer.outer.color || [0, 0, 0, 0]
          this.radiusGradientsUniforms[`${RADIUS_UNIFORMS_NAME}[${this.radiusIndex}].limited`] = layer.limited ? 1 : 0
          this.radiusIndex++
          break
        }
        case 'conic': {
          this.conicGradientsUniforms[`${CONIC_UNIFORMS_NAME}[${this.conicIndex}].center`] = layer.center || [0.5, 0.5]
          this.conicGradientsUniforms[`${CONIC_UNIFORMS_NAME}[${this.conicIndex}].startAngle`] = layer.start.angle || 0
          this.conicGradientsUniforms[`${CONIC_UNIFORMS_NAME}[${this.conicIndex}].startColor`] = layer.start.color || [1, 1, 1, 1]
          this.conicGradientsUniforms[`${CONIC_UNIFORMS_NAME}[${this.conicIndex}].endAngle`] = layer.end.angle || Math.PI * 2
          this.conicGradientsUniforms[`${CONIC_UNIFORMS_NAME}[${this.conicIndex}].endColor`] = layer.end.color || [0, 0, 0, 0]
          this.conicGradientsUniforms[`${CONIC_UNIFORMS_NAME}[${this.conicIndex}].limited`] = layer.limited ? 1 : 0
          this.conicIndex++
          break
        }
      }
    })
    // console.log(this.linearGradientsUniforms)
    // console.log(this.radiusGradientsUniforms)
    // console.log(this.conicGradientsUniforms)
  }

  render(gl, { x, y, width, height }) {
    const buffer = createColorBuffer(gl, { width, height })

    const model = new RectProcessModel(gl, {
      is2: true,
      fs: `#version 300 es
        in vec2 v_uv;

        struct LinearGradient {
          vec2 startPoint;
          vec2 endPoint;
          vec4 startColor;
          vec4 endColor;
          float limited;
        };

        struct RadiusGradient {
          vec2 center;
          float innerRadius;
          vec4 innerColor;
          float outerRadius;
          vec4 outerColor;
          float limited;
        };
        
        struct ConicGradient {
          vec2 center;
          float startAngle;
          vec4 startColor;
          float endAngle;
          vec4 endColor;
          float limited;
        };

        uniform vec4 u_baseColor;
        uniform vec2 u_resolution;
        #if (LINEAR_USE == 1) // 具备线性渐变
          uniform LinearGradient[${this.linearIndex}] ${LINEAR_UNIFORMS_NAME};
        #endif
        #if (RADIUS_USE == 1) // 具备径向渐变
          uniform RadiusGradient[${this.radiusIndex}] ${RADIUS_UNIFORMS_NAME};
        #endif
        #if (CONIC_USE == 1) // 具备圆锥渐变
          uniform ConicGradient[${this.conicIndex}] ${CONIC_UNIFORMS_NAME};
        #endif

        out vec4 fragColor;

        // ps的普通混合算法，高图层的不透明色会有更多优势
        vec4 normalBlend(vec4 baseColor, vec4 blendColor) {
          return mix(baseColor, blendColor, f1 - baseColor.w);
        }

        // 去除了图层优先级的混合算法，透明层级越多，透明度就会越低
        vec4 testBlend(vec4 baseColor, vec4 blendColor) {
          return vec4(mix(baseColor.xyz, blendColor.xyz, f1 - baseColor.w / (baseColor.w + blendColor.w)), f1 - (f1 - baseColor.w) * (f1 - blendColor.w));
        }
        
        void main() {
          vec2 uv = vec2(v_uv.x, f1 - v_uv.y);
          fragColor = u_baseColor;

          #if (LINEAR_USE == 1) // 具备线性渐变
            for (int i = i0; i < ${this.linearIndex}; i += i1) {
              LinearGradient linear = ${LINEAR_UNIFORMS_NAME}[i];
              vec2 vecse = linear.endPoint - linear.startPoint;
              float v = dot((uv * u_resolution - linear.startPoint), vecse) / pow(length(vecse), f2);

              if ((v > f0 && v < f1) || linear.limited == f0) {
                float t = clamp(v, f0, f1);
                #if (LINEAR_INTERPOLATE_TYPE == 0) // 0 means linear
                  // do nothing
                #elif (LINEAR_INTERPOLATE_TYPE == 1) // 1 means exp
                  t = pow(t, 1.25);
                #elif (LINEAR_INTERPOLATE_TYPE == 2) // 2 means log
                  t = pow(t, 0.8);
                #elif (LINEAR_INTERPOLATE_TYPE == 3) // 3 means sin
                  t = fhalf * sin(t * PI - fhalf * PI) + fhalf;
                #endif

                vec4 color = mix(linear.startColor, linear.endColor, t);
                fragColor = testBlend(fragColor, color);
                // fragColor = vec4(vec3(uv.y), f1);
              }
            }
          #endif

          #if (RADIUS_USE == 1) // 具备径向渐变
            for (int i = i0; i < ${this.radiusIndex}; i += i1) {
              RadiusGradient radius = ${RADIUS_UNIFORMS_NAME}[i];
              float len = length(uv * u_resolution - radius.center);
              float v = (len - radius.innerRadius) / (radius.outerRadius - radius.innerRadius);

              if ((v > f0 && v < f1) || radius.limited == f0) {
                float t = clamp(v, f0, f1);
                #if (RADIUS_INTERPOLATE_TYPE == 0) // 0 means linear
                  // do nothing
                #elif (RADIUS_INTERPOLATE_TYPE == 1) // 1 means exp
                  t = pow(t, 1.25);
                #elif (RADIUS_INTERPOLATE_TYPE == 2) // 2 means log
                  t = pow(t, 0.8);
                #elif (RADIUS_INTERPOLATE_TYPE == 3) // 3 means sin
                  t = fhalf * sin(t * PI - fhalf * PI) + fhalf;
                #endif
                vec4 color = mix(radius.innerColor, radius.outerColor, t);
                fragColor = testBlend(fragColor, color);
              }
            }
          #endif
          
          #if (CONIC_USE == 1) // 具备圆锥渐变
            for (int i = i0; i < ${this.conicIndex}; i += i1) {
              ConicGradient conic = ${CONIC_UNIFORMS_NAME}[i];
              vec2 vector = uv * u_resolution - conic.center;
              float angle = atan(-vector.y, -vector.x) * f1dPI * fhalf - 0.25;
              if (angle < f0) angle += f1;
              float v = (angle * PI * f2 - conic.startAngle) / (conic.endAngle - conic.startAngle);

              if ((v > f0 && v < f1) || conic.limited == f0) {
                float t = clamp(v, f0, f1);
                vec4 color = mix(conic.startColor, conic.endColor, t);
                fragColor = testBlend(fragColor, color);
              }
            }
          #endif
        }
      `,
      defines: {
        LINEAR_INTERPOLATE_TYPE: this.params.linearInterpolate,
        LINEAR_USE: this.linearIndex > 0 ? 1 : 0,
        RADIUS_INTERPOLATE_TYPE: this.params.radiusInterpolate,
        RADIUS_USE: this.radiusIndex > 0 ? 1 : 0,
        CONIC_USE: this.conicIndex > 0 ? 1 : 0 // 圆锥渐变不提供插值变化
      },
      uniforms: Object.assign({
        u_baseColor: this.params.base
      }, this.linearGradientsUniforms, this.radiusGradientsUniforms, this.conicGradientsUniforms)
    })

    clear(gl, { color: [0, 0, 0, 0], depth: false, stencil: false, framebuffer: buffer })
    gl.viewport(0, 0, width, height)
    model.uniforms.u_resolution = [width, height]
    model.draw({ framebuffer: buffer })
    const result = buffer.color

    model.delete()
    buffer.delete()

    return result
  }
}
