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
  fragmentShader: `
    uniform float u_time;

    varying vec2 vUv;
  
    const float f0 = 0.0;
    const float f1 = 1.0;
    const float f3 = 3.0;
    const float PI = 3.1415926;
    const float TWO_PI = 6.2831852;

    const float u_starSpeed = 0.5;
    const vec4 u_starColor = vec4(.43,.57,.97, f1);

    vec3 starHash(vec3 x) {
      float starIntensity = 0.5;
      vec3 p = vec3(dot(x, vec3(214.1, 127.7, 125.4)), dot(x, vec3(260.5, 183.3, 954.2)), dot(x, vec3(209.5, 571.3, 961.2)));
      return starIntensity * fract(sin(p) * 43758.5453123);
    }

    float starNoise(vec3 v3) {
      v3 += vec3(f0, u_starSpeed * u_time, f0); // 将时间掺入伪随机种子中

      vec3 i = floor(v3); // 取其整数部分（参考柏林噪声是用于查找晶格）
      vec3 f = fract(v3); // 取其小数部分（参考柏林噪音是用于查找插值的uv）

      vec3 u = f * f * vec3(f3 - f.x, f3 - f.y, f3 - f.z);

      return mix(
        mix(
          dot(starHash(i + vec3(f0, f0, f0)), f - vec3(f0, f0, f0)),
          dot(starHash(i + vec3(f1, f0, f0)), f - vec3(f1, f0, f0)),
          u.x
        ),
        mix(
          dot(starHash(i + vec3(f0, f1, f0)), f - vec3(f0, f1, f0)),
          dot(starHash(i + vec3(f1, f1, f0)), f - vec3(f1, f1, f0)),
          u.y
        ),
        u.z
      );
    }
 
    void main() {
      // 渐变
      float y = (vUv.y - 0.5) * 2.0;
      float p1 = f1 - pow(min(f1, f1 - y), 1.2);
      float p3 = f1 - pow(min(f1, f1 + y), 1.2);
      float p2 = f1 - p1 - p3;
      vec3 c1 = vec3(f0, f0, f0);
      vec3 c2 = vec3(0.2353, 0.3059, 0.4745);
      vec3 c3 = vec3(f0, f0, f0);
      float intensity = f1;

      vec4 skyColor = vec4((c1 * p1 + c2 * p2 + c3 * p3) * intensity, f1);
      float star = starNoise(vec3(vUv.xy * 64.0, f1)) * 1.25;
      // vec4 starColor = vec4(
      //   u_starColor.r + 3.25 * sin(vUv.x) + 2.45 * (sin(u_starSpeed * u_time) + f1) * 0.5,
      //   u_starColor.g + 3.85 * sin(vUv.y) + 1.45 * (sin(u_starSpeed * u_time) + f1) * 0.5,
      //   u_starColor.b + 3.45 * sin(vUv.y) + 4.45 * (sin(u_starSpeed * u_time) + f1) * 0.5,
      //   0.2
      // );
      star = smoothstep(0.7, 1.0, star);
      vec4 starColor = vec4(star);

      gl_FragColor = mix(skyColor, starColor, starColor.a);
    }
  `
}
