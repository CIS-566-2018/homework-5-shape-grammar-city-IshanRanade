import PropertyHolder from "./PropertyHolder";
import { vec3, vec4, mat4 } from "gl-matrix";
import OBJGeometry from "../geometry/OBJGeometry";
import Drawable from "../rendering/gl/Drawable";
import Colony from "./Colony";

class World {

  geometry: { [key:string]:PropertyHolder; };
  drawableGeometry: { [key:string]:OBJGeometry; };
  meshes: any;
  types: string[];
  center: vec3;
  up: vec3;
  seed: any;
  
  constructor(meshes: any, types: string[], center: vec3, up: vec3, seed: any) {
    this.meshes = meshes;
    this.types = types;
    this.center = center;
    this.up = up;
    this.seed = seed;


    // Set the model matrices for each type of geometry
    this.drawableGeometry = {};
    let trans: { [key:string]:mat4; } = {};
    trans['tank'] = mat4.create();
    trans['base'] = mat4.create();
    trans['door'] = mat4.create();
    trans['crater'] = mat4.create();
    trans['road'] = mat4.create();

    trans['platform'] = mat4.create();
    mat4.scale(trans['platform'], trans['platform'], vec3.fromValues(0.2,0.2,0.2));

    this.types.forEach(type => {
      this.drawableGeometry[type] = new OBJGeometry(vec3.fromValues(0,0,0), meshes, type, vec4.fromValues(0.5,0.5,0.5,1), trans[type]);
    });



    this.geometry = {};
    this.types.forEach(type => {
      this.geometry[type] = new PropertyHolder();
    });

    this.generate();
  }

  generate() {
    let colony: Colony = new Colony(this.geometry, this.seed, vec3.fromValues(0,0,0), this.up, 1);
  }

  create() {
    this.types.forEach(type => {
      this.drawableGeometry[type].setInstanceProperties(this.geometry[type].translations, this.geometry[type].quaternions, this.geometry[type].scales, this.geometry[type].translations.length / 4);
      this.drawableGeometry[type].create();
    });
  }

  getDrawables() {
    let drawables: Array<Drawable> = [];
    
    this.types.forEach(type => {
      let drawable: OBJGeometry = this.drawableGeometry[type];
      drawables.push(this.drawableGeometry[type]);
    });

    return drawables;
  }

}

export default World;