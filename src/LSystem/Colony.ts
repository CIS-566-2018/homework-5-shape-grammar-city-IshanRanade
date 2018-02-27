import { vec3, vec4 } from "gl-matrix";
import PropertyHolder from "./PropertyHolder";

class Colony {

  geometry: { [key:string]:PropertyHolder; };
  center: vec3;
  up: vec3;
  radius: number;
  meshes: any;

  constructor(meshes: any, geometry: { [key:string]:PropertyHolder; }, center: vec3, up: vec3, radius: number) {
    this.meshes = meshes;
    this.geometry = geometry;
    this.center = center;
    this.up = up;
    this.radius = radius;

    this.generate();
  }

  generate() {
    this.geometry['crater'].add(vec4.fromValues(0,0,0,0), vec4.fromValues(0,0,0,1), vec4.fromValues(1,1,1,1));
  }
}

export default Colony;