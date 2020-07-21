var GaussianBlurShader = {
  defines: {
    KERNEL_RADIUS: 3,
    SIGMA: 3
  },
  uniforms: {
    tDiffuse: { value: null }
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
    #define f1 1.0
    #define f0 0.0
    #define i1 1

    uniform sampler2D tDiffuse;
    uniform vec2 tSize;
    uniform vec2 direction;

    varying vec2 vUv;

    // 生成一个x位置的一维正态分布值
    float oneDimensionalGaussian (in float x, in float sigma) {
      return inverse_sqrt_2p / sigma * exp((-x * x) / (2.0 * sigma * sigma));
    }
    
    void main() {
      vec2 unitSize = f1 / tSize;
      float sigma = float(SIGMA);
      float weightSum = oneDimensionalGaussian(f0, sigma);
      vec3 diffuseSUm = texture2D( tDiffuse, vUv).rgb * weightSum;

      for (int i = i1; i < KERNEL_RADIUS; i++ ) {

      }

    	gl_FragColor = texture2D( tDiffuse, vUv );
    }
  `
}

export { GaussianBlurShader }
