var Power = {
  uniforms: {
    tDiffuse: { value: null },
    power: { value: 6.3 } // Math.pow(10, 0.8)
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float power;

    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color = pow(color, vec4(power));
      gl_FragColor = color;
    }
  `
}

export { Power }
