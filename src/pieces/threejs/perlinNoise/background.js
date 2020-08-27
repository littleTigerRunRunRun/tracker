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
    },
    u_permutation: {
      value: []
    },
    u_gradient: {
      value: []
    },
    u_brightness: {
      value: 1.0
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
    // https://www.cnblogs.com/leoin2012/p/7218033.html
    // https://blog.csdn.net/yolon3000/article/details/77073701
    varying vec2 vUv;
    uniform float u_time;
    uniform float u_cell;
    uniform float u_brightness;
    uniform vec2 u_resolution;
    uniform int[256] u_permutation;
    uniform vec2[8] u_gradient;

    const int i255 = 255;
    const int i7 = 7;
    const int i1 = 1;
    const float f1 = 1.0;

    float randome(vec2 st) {
      // + sin(u_time * 0.0001)
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 一个平滑的线性差值方法
    float fade(float t) {
      return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    float lerp(float v1, float v2, float t) {
      return v1 * (f1 - t) + v2 * t;
    }
 
    void main() {
      vec2 st = vUv * u_resolution / u_cell + vec2(0.02, 0.02);
      ivec2 sti = ivec2(floor(st.x), floor(st.y));
      vec2 stf = vec2(st.x - float(sti.x), st.y - float(sti.y));

      vec2 grad11 = u_gradient[u_permutation[(sti.x + u_permutation[sti.y % i255]) % i255] % i7];
      vec2 grad12 = u_gradient[u_permutation[(sti.x + i1 + u_permutation[sti.y % i255]) % i255] % i7];
      vec2 grad21 = u_gradient[u_permutation[(sti.x + u_permutation[(sti.y + i1) % i255]) % i255] % i7];
      vec2 grad22 = u_gradient[u_permutation[(sti.x + i1 + u_permutation[(sti.y + i1) % i255]) % i255] % i7];

      float noise11 = dot(grad11, stf);
      float noise12 = dot(grad12, vec2(stf.x - f1, stf.y));
      float noise21 = dot(grad21, vec2(stf.x, stf.y - f1));
      float noise22 = dot(grad22, vec2(stf.x - f1, stf.y - f1));

      float u = fade(stf.x);
      float v = fade(stf.y);

      float value = lerp(lerp(noise11, noise12, u) * (f1 - v), lerp(noise21, noise22, u), v);
      value = value + 0.6;

      gl_FragColor = vec4(value, value, value, 1.0);
    }
  `
}
