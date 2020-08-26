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
  
    const float f1 = 1.0;
    const float PI = 3.1415926;
    const float TWO_PI = 6.2831852;

    float random (vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233)) + sin(u_time * 0.0001)) * 43758.5453123);
    }
 
    void main() {
      gl_FragColor = vec4(vec3(random(vUv)), 1.0);
    }
  `
}