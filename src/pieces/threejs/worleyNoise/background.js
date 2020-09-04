import {
  Vector2
} from '@/lib/three.module.js'

export default {
  uniforms: {
    u_time: {
      value: 0.0
    },
    u_resolution: {
      value: new Vector2(1.0, 1.0)
    },
    u_cell: {
      value: 32.0
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

    const int i1 = 1;
    const float f1 = 1.0;
    const vec3 MOD3 = vec3(0.1031, 0.11369, 0.13787); // 三维随机数所用的一个常量
    // 算法见https://blog.csdn.net/yolon3000/article/details/78106203
    // N是维度，本案例是三维，N = 3
    const float F3 = 0.333333; // 1/3 F = (sqrt(N + 1) - 1) / N
    const float G3 = 0.166667; // 1/6 G = (1 - 1 / sqrt(N + 1)) / N

    // 一个维三维随机向量的产生方法，copy自 https://www.shadertoy.com/view/lt3SRX
    vec3 random3(vec3 p3) {
      p3 = fract(p3 * MOD3);
      p3 += dot(p3, p3.yxz + 19.19);
      return -f1 + 2.0 * fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
    }

    // 产生三维simplex噪声
    float simplex3d(vec3 p) {
      // 1.找到当前的四面体T以及它的四个顶点
      vec3 s = floor(p + dot( p, vec3(F3) )); // 将等边三角形晶格变换成直角三角形并且得到当前晶格序列
      vec3 x = p - (vec3(s) - dot(vec3(s), vec3(G3)) ); // 从变换后的晶格坐标变换回来求出当前点到三角晶格的偏移量, 0, 0

      /* calculate i1 and i2 */
      // 一段非常精妙的写法，简化了多重判断
      vec3 e = step(vec3(0.0), x - x.yzx);
      vec3 i1 = e * (f1 - e.zxy);
      vec3 i2 = f1 - e.zxy*(f1 - e);
      vec3 i3 = vec3(f1);

      // 求出四面体另外几个点的位置
      vec3 x1 = x - i1 + G3; // 第二个点，偏移坐标是i1, i1.x + i1.y + i1.z = 1， 所以有这个公式
      vec3 x2 = x - i2 + G3 * 2.0;
      vec3 x3 = x - i3 + G3 * 3.0;

      vec4 dist = vec4(dot(x, x), dot(x1, x1), dot(x2, x2), dot(x3, x3));
      vec4 left = max(0.6 - dist, 0.0); // max(0, r2 − |dist|2), r2取0.5或者0.6
      left *= left;
      left *= left;

      vec4 grad;
      grad.x = dot(random3(s), x);
      grad.y = dot(random3(s + i1), x1);
      grad.z = dot(random3(s + i2), x2);
      grad.w = dot(random3(s + f1), x3);
      
      grad *= left;

      return dot(grad, vec4(52.0));
    }

    float fbm(vec3 stt) {
      return 0.5333 * simplex3d(stt) +
             0.2667 * simplex3d(stt * 2.0) +
             0.1333 * simplex3d(stt * 4.0) +
             0.0667 * simplex3d(stt * 8.0);
    }

    void main() {
      vec3 stt = vec3(vUv, u_time * 0.00002); // st + time

      float value;
      if (stt.x < 0.5) {
        value = simplex3d(stt * u_cell);
      } else {
        value = fbm(stt * u_cell * 0.25);
      }

      value = 0.5 + 0.5 * value;

      gl_FragColor = vec4(vec3(value), f1);
    }
  `
}
