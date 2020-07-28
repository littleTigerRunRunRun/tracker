import {
  Vector2
} from '@/lib/three.module.js'

var BoxBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new Vector2(1.0, 1.0) },
    direction: { value: new Vector2(1.0, 0.0) },
    kernelRadius: { value: 2 }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    #define inverse_sqrt_2p 0.39894228
    #define f2 2.0
    #define f1 1.0
    #define f0 0.0
    #define i1 1

    uniform sampler2D tDiffuse;
    uniform vec2 tSize;
    uniform vec2 direction;
    uniform int kernelRadius;

    varying vec2 vUv;
    
    void main() {
      if (kernelRadius == 0) {
        gl_FragColor = texture2D( tDiffuse, vUv).rgba;
      } else {
        vec2 unitSize = f1 / tSize;
        float weightUnit = f1 / float(kernelRadius);
        float weightSum = weightUnit;
        vec3 diffuseSum = texture2D( tDiffuse, vUv).rgb * weightSum;
  
        // 这里其实是从-(kernelRadius - 1) kernelRadius - 1
        for (int i = i1; i < kernelRadius; i++ ) {
          float x = float(i);
          vec2 offset = direction * x * unitSize;
          vec3 sampler1 = texture2D(tDiffuse, vUv + offset).rgb;
          vec3 sampler2 = texture2D(tDiffuse, vUv - offset).rgb;
          diffuseSum += (sampler1 + sampler2) * weightUnit;
          weightSum += weightUnit * f2;
        }
  
        gl_FragColor = vec4(diffuseSum / weightSum, 1.0);
      }
    }
  `
}

export { BoxBlurShader }
