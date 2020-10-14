const lightStruct = `
  struct AmbientLight {
    vec3 color;
  };
  struct DirectionalLight {
    vec3 color;
    vec3 direction;
  };
  struct IncidentLight {
    vec3 color;
    vec3 direction;
  };
  struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
  };
`

// foward render模型的光照，它主要由以下概念组成
// 1. ambient light 唯一的全局光照，是一种没有方向的，充斥在空间中的光照
export default function combineLight({ ambient, directional }) {
  const index = 0
  const uniforms = {}
  const frags = {}
  const defines = {}

  let ambientPatch = ''
  frags.ambient = ''
  if (ambient && ambient.color && ambient.intensity) {
    ambientPatch = `
      uniform AmbientLight u_ambient_light;
    `
    uniforms['u_ambient_light.color'] = ambient.color.map((c) => c * ambient.intensity)
    frags.ambient = `
      // 假使具备环境光
      v_color += u_ambient_light.color;
    `
  }

  let directionalPatch = ''
  frags.directionalDiffuss = ''
  frags.directionalSpecular = ''
  if (directional && directional.length > 0) {
    // 平行光源数据植入
    defines.DIRECTIONAL_LENGTH = directional.length
    directionalPatch = `
      uniform DirectionalLight u_directional_light[DIRECTIONAL_LENGTH]; 
    `
    for (let i = 0; i < directional.length; i++) {
      uniforms[`u_directional_light[${i}].color`] = directional[i].color.map((c) => c * directional[i].intensity)
      uniforms[`u_directional_light[${i}].direction`] = directional[i].direction
    }
    // 平行光源造成的漫反射结果
    frags.directionalDiffuss = `
      // dot(veca, vecb) / |a| / |b| 求出相关性高低， 不超过0
      float diffuseStrength = 0.5;
      for (int i = 0; i < DIRECTIONAL_LENGTH; i++) {
        v_color += diffuseStrength * max(dot(modelNormal, u_directional_light[i].direction) / length(modelNormal) / length(u_directional_light[i].direction), f0) * u_directional_light[i].color;
      }
    `
    // 平行光源造成的镜面反射结果
    // directionalSpecularPatch = `
    //   // 视角与反射光夹角的相关性作为镜面反射的结果
    //   for (int i = 0; i < DIRECTIONAL_LENGTH; i++) {

    //   }
    // `
  }

  return {
    name: 'lights',
    defines,
    uniforms,
    vs: `
      ${lightStruct}

      ${ambientPatch}
      ${directionalPatch}
    `,
    fs: `
      ${lightStruct}

      ${directionalPatch}
    `,
    frags
  }
}
