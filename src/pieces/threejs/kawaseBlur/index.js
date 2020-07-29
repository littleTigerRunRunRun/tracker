import {
  Vector2
} from '@/lib/three.module.js'

var KawaseBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new Vector2(1.0, 1.0) },
    radius: { value: 0.0 }
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
    #define half 0.5

    uniform sampler2D tDiffuse;
    uniform vec2 tSize;
    uniform float radius;

    varying vec2 vUv;
    
    void main() {
      if (radius == 0.0) {
        gl_FragColor = texture2D( tDiffuse, vUv).rgba;
      } else {
        vec2 unitSize = f1 / tSize;
        vec3 sampler1 = texture2D(tDiffuse, vUv + unitSize * vec2(radius + half, radius + half)).rgb;
        vec3 sampler2 = texture2D(tDiffuse, vUv + unitSize * vec2(-radius - half, radius + half)).rgb;
        vec3 sampler3 = texture2D(tDiffuse, vUv + unitSize * vec2(-radius - half, -radius - half)).rgb;
        vec3 sampler4 = texture2D(tDiffuse, vUv + unitSize * vec2(radius + half, -radius - half)).rgb;
        gl_FragColor = vec4((sampler1 + sampler2 + sampler3 + sampler4) * half * half, f1);
      }
    }
  `
}

export { KawaseBlurShader }
