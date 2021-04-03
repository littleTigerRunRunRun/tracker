import * as THREE from '../../../../lib/three.module'
import { Mesh } from '../objects/Mesh'
import { OBJLoader } from '../../../../lib/loaders/OBJLoader'
import { MTLLoader } from '../../../../lib/loaders/MTLLoader'
import { Texture } from '../textures/Texture'
import { Material } from '../materials/Material'
import { MeshRender } from '../renderers/MeshRender'
import { VertexShader, FragmentShader } from '../shaders/InternalShader'

export function loadOBJ(renderer, path, name) {
  const manager = new THREE.LoadingManager()
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total)
  }

  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total * 100
      console.log('model ' + Math.round(percentComplete, 2) + '% downloaded')
    }
  }
  function onError() { }

  new MTLLoader(manager)
    .setPath(path)
    .load(name + '.mtl', function(materials) {
      materials.preload()
      new OBJLoader(manager)
        .setMaterials(materials)
        .setPath(path)
        .load(name + '.obj', function(object) {
          object.traverse(function(child) {
            if (child.isMesh) {
              const geo = child.geometry
              let mat
              if (Array.isArray(child.material)) mat = child.material[0]
              else mat = child.material

              var indices = Array.from({ length: geo.attributes.position.count }, (v, k) => k)
              const mesh = new Mesh({ name: 'aVertexPosition', array: geo.attributes.position.array },
                { name: 'aNormalPosition', array: geo.attributes.normal.array },
                { name: 'aTextureCoord', array: geo.attributes.uv.array },
                indices)

              let colorMap = null
              if (mat.map != null) colorMap = new Texture(renderer.gl, mat.map.image)
              // MARK: You can change the myMaterial object to your own Material instance

              let textureSample = 0
              let myMaterial
              if (colorMap != null) {
                textureSample = 1
                myMaterial = new Material({
                  'uSampler': { type: 'texture', value: colorMap },
                  'uTextureSample': { type: '1i', value: textureSample },
                  'uKd': { type: '3fv', value: mat.color.toArray() }
                }, [], VertexShader, FragmentShader)
              } else {
                myMaterial = new Material({
                  'uTextureSample': { type: '1i', value: textureSample },
                  'uKd': { type: '3fv', value: mat.color.toArray() }
                }, [], VertexShader, FragmentShader)
              }

              const meshRender = new MeshRender(renderer.gl, mesh, myMaterial)
              renderer.addMesh(meshRender)
            }
          })
        }, onProgress, onError)
    })
}
