export default {
  uniforms: {},
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
  
    const float f1 = 1.0;
    const float PI = 3.1415926;
    const float TWO_PI = 6.2831852;

    vec3 starHash(vec3 x) {
      float starIntensity = 0.5;
      vec3 p = vec3(dot(x, vec3(214.1, 127.7, 125.4)), dot(x, vec3(260.5, 183.3, 954.2)), dot(x, vec3(209.5, 571.3, 961.2)));
      return vec3(-0.001, -0.001, -0.001) + starIntensity * fract(sin(p) * 43758.5453123);
    }
 
    void main() {
      // 渐变
      float y = (vUv.y - 0.5) * 2.0;
      float p1 = f1 - pow(min(f1, f1 - y), 1.2);
      float p3 = f1 - pow(min(f1, f1 + y), 1.2);
      float p2 = f1 - p1 - p3;
      vec3 c1 = vec3(0.0, 0.0, 0.0);
      vec3 c2 = vec3(0.2353, 0.3059, 0.4745);
      vec3 c3 = vec3(0.0, 0.0, 0.0);
      float intensity = 1.0;

      gl_FragColor = vec4((c1 * p1 + c2 * p2 + c3 * p3) * intensity, 1.0);
    }
  `
}
