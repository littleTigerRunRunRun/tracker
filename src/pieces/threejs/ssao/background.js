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
    const float f0 = 0.0;
    const float PI = 3.1415926;
    const float TWO_PI = 6.2831852;

    float random (vec2 st) {
      // + sin(u_time * 0.00002)
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float lerp(float v1, float v2, float t) {
      return v1 * (f1 - t) + v2 * t;
    }
 
    void main() {
      // white noise
      // gl_FragColor = vec4(vec3(random(vUv)), f1);

      // block noise
      // vec2 st = floor(vUv * 32.0);
      // gl_FragColor = vec4(vec3(random(st)), f1);

      // value noise
      vec2 st = vUv * 32.0;
      vec2 sti = floor(st);
      vec2 stf = st - sti;

      float r1 = random(sti);
      float r2 = random(sti + vec2(f1, f0));
      float r3 = random(sti + vec2(f0, f1));
      float r4 = random(sti + vec2(f1, f1));

      float value = lerp(
        lerp(r1, r2, stf.x),
        lerp(r3, r4, stf.x),
        stf.y
      );

      gl_FragColor = vec4(vec3(value), f1);
    }
  `
}
