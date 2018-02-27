import {vec3, vec4, mat4, mat3, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import LSystem from './LSystem';
import Node from './Node'
import Turtle from './Turtle';
import BuildingPart from '../geometry/BuildingPart';
import PropertyHolder from '../geometry/PropertyHolder';

class Building {
  originTranslation: vec3;
  originAim: vec3;
  originScale: vec3;
  originUp: vec3;

  lotX: number;
  lotY: number;

  meshes: any;

  buildingParts: { [key:string]:PropertyHolder; };

  constructor(meshes: any, originTranslation: vec3, originAim: vec3, originScale: vec3, originUp: vec3) {
    this.meshes = meshes;
    this.originTranslation = originTranslation;
    this.originAim = originAim;
    this.originScale = originScale;
    this.originUp = originUp;
    this.buildingParts = {};
    this.buildingParts['base'] = new PropertyHolder();

    this.createLayout();
  }

  createLayout() {
    this.buildingParts['base'].add(vec4.fromValues(0,0,0,0), vec4.fromValues(0,0,0,1), vec4.fromValues(1,1,1,1));
  }
}

export default Building;