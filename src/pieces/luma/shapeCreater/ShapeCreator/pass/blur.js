// this.blurPass = new ShaderPass({
//   fs: `#version 300 es

//     uniform sampler2D t_geo;
//     uniform vec2 u_resolution;

//     in vec2 v_uv;

//     out vec4 fragColor;

//     const float inverse_sqrt_2p = 0.39894228;
//     const float sigma = 2.0;
//     const int kernelRadius = 2;

//     // 生成一个x位置的一维正态分布值
//     float oneDimensionalGaussian (in float x) {
//       return inverse_sqrt_2p / sigma * exp((-x * x) / (f2 * sigma * sigma));
//     }

//     vec4 gaussianBlur(sampler2D tImage, vec2 uv) {
//       vec2 direction = vec2(0.0, 1.0);
//       vec2 unitSize = f1 / u_resolution;
//       float weightSum = oneDimensionalGaussian(f0);
//       vec3 diffuseSum = texture2D(tImage, uv).rgb * weightSum;

//       // 这里其实是从-(kernelRadius - 1) kernelRadius - 1
//       for (int i = 1; i < kernelRadius; i++ ) {
//         float x = float(i);
//         float w = oneDimensionalGaussian(x);
//         vec2 offset = direction * x * unitSize;
//         vec3 sampler1 = texture2D(tImage, uv + offset).rgb;
//         vec3 sampler2 = texture2D(tImage, uv - offset).rgb;
//         diffuseSum += (sampler1 + sampler2) * w;
//         weightSum += w * f2;
//       }

//       return vec4(diffuseSum / weightSum, 1.0);
//     }

//     void main() {
//       // fragColor = fxaa_sampleColor(t_geo, u_resolution, v_uv);
//       fragColor = texture2D(t_geo, v_uv); // gaussianBlur(t_geo, v_uv);
//     }
//   `,
//   render({ gl, time, extraUniforms, model }) {
//     setParameters(gl, {
//       blend: false
//     })
//     // const fragment = model.program.fs.handle
//     // console.log(gl.getShaderSource(fragment))

//     model.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
//     model.draw()
//   },
//   target: null
// })
