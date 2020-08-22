import {
  Vector2
} from '@/lib/three.module.js'

export default {
  uniforms: {
    u_time: {
      value: 0.0
    },
    u_resolution: {
      value: new Vector2(1.0, 0.0)
    },
    u_cell: {
      value: 8
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float u_time;
    uniform float u_cell;
    uniform vec2 u_resolution;
  
    const float f1 = 1.0;
    const float PI = 3.1415926;
    const float TWO_PI = 6.2831852;

    float random (vec2 st) {
      // + sin(u_time * 0.0001)
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
 
    void main() {
      vec2 st = fract(vUv * u_resolution / u_cell);
      gl_FragColor = vec4(vec3(length(st)), 1.0);
    }
  `
}
