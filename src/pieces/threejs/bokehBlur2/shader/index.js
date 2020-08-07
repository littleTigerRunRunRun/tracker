/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Depth-of-field shader with bokeh
 * ported from GLSL shader by Martins Upitis
 * http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
 */

var BokehShader2 = {

  defines: {
    'DEPTH_PACKING': 1,
    'PERSPECTIVE_CAMERA': 1
  },

  uniforms: {

    'tColor': { value: null },
    'tDepth': { value: null },
    'focus': { value: 1.0 },
    'aspect': { value: 1.0 },
    'aperture': { value: 0.025 },
    'maxblur': { value: 0.01 },
    'nearClip': { value: 1.0 },
    'farClip': { value: 1000.0 },
    'startAngle': { value: 0.0 }

  },

  vertexShader: [

    'varying vec2 vUv;',

    'void main() {',

    '	vUv = uv;',
    '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'

  ].join('\n'),

  fragmentShader: `
    #include <common>

    varying vec2 vUv;

    uniform sampler2D tColor;
    uniform sampler2D tDepth;

    uniform float maxblur; // max blur amount
    uniform float aperture; // aperture - bigger values for shallower depth of field

    uniform float nearClip;
    uniform float farClip;

    uniform float focus;
    uniform float aspect;

    uniform float angle;

    #include <packing>

    float getDepth( const in vec2 screenPosition ) {
      #if DEPTH_PACKING == 1
      return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
      #else
      return texture2D( tDepth, screenPosition ).x;
      #endif
    }

    float getViewZ( const in float depth ) {
      #if PERSPECTIVE_CAMERA == 1
      return perspectiveDepthToViewZ( depth, nearClip, farClip );
      #else
      return orthographicDepthToViewZ( depth, nearClip, farClip );
      #endif
    }
    float random(vec3 scale, float seed) {
      /* use the fragment position for a different seed per-pixel */
      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void main() {

      vec2 aspectcorrect = vec2( 1.0, aspect );

      float viewZ = getViewZ( getDepth( vUv ) );

      float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

      float dofblur = factor * aperture;

      vec2 delta = vec2(sin(angle) * dofblur, cos(angle) * dofblur);
      float offset = random(vec3(delta, 151.7182), 0.0);

      vec4 color = vec4(0.0);
      for (float t = 0.0; t < 30.0; t++) {
        float percent = (t + offset) / 30.0;
        color += texture2D(tColor, vUv + aspectcorrect * percent * delta);
      }

      gl_FragColor = color / 30.0;

    }
  `
}

export { BokehShader2 }
