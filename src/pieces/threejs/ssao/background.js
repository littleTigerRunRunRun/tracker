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
    tDepth: {
      value: null
    },
    nearClip: {
      value: 0.1
    },
    farClip: {
      value: 2000.0
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
    #include <common>
    #include <packing>

    varying vec2 vUv;
    uniform sampler2D tDepth;
    uniform float nearClip;
    uniform float farClip;
    uniform float u_time;

    float getDepth( const in vec2 screenPosition ) {
      return texture2D( tDepth, screenPosition ).x;
    }

    float getViewZ( const in float depth ) {
      return perspectiveDepthToViewZ( depth, nearClip, farClip );
    }

    void main() {
      // if (vUv.x < 0.5) gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
      // else
      float value = getDepth(vUv) + 0.5;
      gl_FragColor = vec4(value, value, value, 1.0);
    }
  `
}
