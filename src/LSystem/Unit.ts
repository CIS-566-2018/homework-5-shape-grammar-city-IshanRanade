import Building from "./Building";
import { vec3, vec4 } from "gl-matrix";
import PropertyHolder from "../LSystem/PropertyHolder";

class Unit {

  geometry: { [key:string]:PropertyHolder; };
  center: vec3;
  up: vec3;
  radius: number;
  seed: any;

  constructor(geometry: { [key:string]:PropertyHolder; }, seed: any, center: vec3, up: vec3, radius: number) {
    this.geometry = geometry;
    this.center = center;
    this.up = up;
    this.radius = radius;
    this.seed = seed;

    this.generate();
  }

  generate() {
    this.geometry['platform'].add(vec4.fromValues(0,0,0,0), vec4.fromValues(0,0,0,1), vec4.fromValues(1,1,1,1));

  }
}

export default Unit;