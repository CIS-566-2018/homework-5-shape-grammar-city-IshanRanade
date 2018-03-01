import {vec3, vec4, mat4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class OBJGeometry extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  center: vec4;

  translations: Float32Array;
  quaternions: Float32Array;
  scales: Float32Array;
  instanceColors: Float32Array;

  instances: number = 0;

  meshes: any;
  buildingPart: string;
  color: vec4;
  model: mat4;

  constructor(center: vec3, meshes: any, buildingPart: string, color: vec4, model: mat4) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.isInstanced = true;
    this.meshes = meshes;
    this.buildingPart = buildingPart;
    this.color = color;
    this.model = model;
  }

  setInstanceProperties(translations: number[], quaternions: number[], scales: number[], colors: number[], numInstances: number) {
    this.translations = new Float32Array(translations);
    this.quaternions = new Float32Array(quaternions);
    this.scales = new Float32Array(scales);
    this.instanceColors = new Float32Array(colors);
    this.instances = numInstances;
  }

  create() {
    let mesh: any = this.meshes[this.buildingPart];

    let tempIndices: number[] = [];
    let tempPositions: number[] = [];
    let tempNormals: number[] = [];
    let tempColors: number[] = [];

    for(let i: number = 0; i < mesh.indices.length; ++i) {
      tempIndices.push(mesh.indices[i]);

      let tempNormal: vec4 = vec4.fromValues(mesh.vertexNormals[i*3], mesh.vertexNormals[i*3+1], mesh.vertexNormals[i*3+2], 0);
      let tempPosition: vec4 = vec4.fromValues(mesh.vertices[i*3], mesh.vertices[i*3+1], mesh.vertices[i*3+2], 1);

      vec4.transformMat4(tempNormal, tempNormal, this.model);
      vec4.transformMat4(tempPosition, tempPosition, this.model)

      tempNormals.push(tempNormal[0], tempNormal[1], tempNormal[2], 0);
      tempPositions.push(tempPosition[0], tempPosition[1], tempPosition[2], 1);

      tempColors.push(this.color[0], this.color[1], this.color[2], this.color[3]);
    }

    this.indices = new Uint32Array(tempIndices);
    this.normals = new Float32Array(tempNormals);
    this.positions = new Float32Array(tempPositions);
    this.colors = new Float32Array(tempColors);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateCol();
    this.generateTranslations();
    this.generateQuaternions();
    this.generateScales();
    this.generateInstanceColors();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslations);
    gl.bufferData(gl.ARRAY_BUFFER, this.translations, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufQuaternions);
    gl.bufferData(gl.ARRAY_BUFFER, this.quaternions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufScales);
    gl.bufferData(gl.ARRAY_BUFFER, this.scales, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufInstanceColors);
    gl.bufferData(gl.ARRAY_BUFFER, this.instanceColors, gl.STATIC_DRAW);
  }
};

export default OBJGeometry;
