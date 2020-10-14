export const cosInter = {
  name: 'cosInter',
  defines: {
    TAU: 6.2831852
  },
  vs: '',
  fs: `
    // color(t) = a + b ⋅ cos[ 2π( c ⋅ t + d ) ]
    // a偏移 b振幅 c波长 d相位
    vec3 cosInter(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(TAU * (c * t + d));
    }
  `
}
