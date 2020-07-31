import {
  Vector2
} from '@/lib/three.module.js'

var UpDownKawaseBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new Vector2(1.0, 1.0) },
    radius: { value: 0.0 },
    samplerRate: { value: 1.0 },
    direction: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    #define f1 1.0
    #define f2 2.0
    #define f0 0.0
    #define half 0.5

    uniform sampler2D tDiffuse;
    uniform float samplerRate;
    uniform vec2 tSize;
    uniform float radius;
    uniform float direction;

    varying vec2 vUv;
    
    void main() {
      vec2 samplerUV = vUv * samplerRate;
      if (samplerUV.x > f1 || samplerUV.y > f1) discard;
      if (radius == f0) {
        gl_FragColor = texture2D( tDiffuse, samplerUV).rgba;
      } else {
        if (direction > f0) {
          vec2 unitSize = f1 / tSize;
          vec3 sampler1 = texture2D(tDiffuse, samplerUV + unitSize * vec2(radius + half, radius + half)).rgb;
          vec3 sampler2 = texture2D(tDiffuse, samplerUV + unitSize * vec2(-radius - half, radius + half)).rgb;
          vec3 sampler3 = texture2D(tDiffuse, samplerUV + unitSize * vec2(-radius - half, -radius - half)).rgb;
          vec3 sampler4 = texture2D(tDiffuse, samplerUV + unitSize * vec2(radius + half, -radius - half)).rgb;
          gl_FragColor = vec4((texture2D(tDiffuse, samplerUV).rgb * f2 * f2 + sampler1 + sampler2 + sampler3 + sampler4) * half * half * half, f1);
        } else {
          vec2 unitSize = f1 / tSize;
          vec3 sampler1 = texture2D(tDiffuse, samplerUV + unitSize * radius * vec2(f1, f1)).rgb * f2;
          vec3 sampler2 = texture2D(tDiffuse, samplerUV + unitSize * radius * vec2(f2, f0)).rgb;
          vec3 sampler3 = texture2D(tDiffuse, samplerUV + unitSize * radius * vec2(f0, f2)).rgb;
          vec3 sampler4 = texture2D(tDiffuse, samplerUV + unitSize * radius * vec2(f1, -f1)).rgb * f2;
          vec3 sampler5 = texture2D(tDiffuse, samplerUV - unitSize * radius * vec2(f1, f1)).rgb * f2;
          vec3 sampler6 = texture2D(tDiffuse, samplerUV - unitSize * radius * vec2(f2, f0)).rgb;
          vec3 sampler7 = texture2D(tDiffuse, samplerUV - unitSize * radius * vec2(f0, f2)).rgb;
          vec3 sampler8 = texture2D(tDiffuse, samplerUV - unitSize * radius * vec2(f1, -f1)).rgb * f2;
          gl_FragColor = vec4((sampler1 + sampler2 + sampler3 + sampler4 + sampler5 + sampler6 + sampler7 + sampler8) * 0.083333, f1);
        }
      }
    }
  `
}

export { UpDownKawaseBlurShader }
