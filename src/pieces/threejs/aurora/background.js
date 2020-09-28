import fragmentShader from './backFrag.glsl'

// https://www.shadertoy.com/view/XtGGRt
export default {
  uniforms: {
    u_time: {
      value: 0.0
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader
}
