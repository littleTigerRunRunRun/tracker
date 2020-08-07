import {
  Vector2
} from '@/lib/three.module.js'

var RadiulBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new Vector2(1.0, 1.0) },
    radius: { value: 0.0 },
    center: { value: new Vector2(0.5, 0.5) }
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
    uniform vec2 center;

    varying vec2 vUv;
    
    void main() {
      if (radius == 0.0) {
        gl_FragColor = texture2D( tDiffuse, vUv).rgba;
      } else {
        // vec2 unitSize = f1 / tSize;
        vec2 toCenter = center - vUv;
        vec4 color = vec4(0.0);
        float total = 0.0;
        for (float i = 0.0; i < 40.0; i++) {
          float percent = i / 40.0;
          float weight = percent * percent;
          vec4 sampler = texture2D(tDiffuse, vUv + toCenter * percent * radius / tSize);
          
          color += sampler * weight;
          total += weight;
        }
        gl_FragColor = color / total;
      }
    }
  `
}

export { RadiulBlurShader }
