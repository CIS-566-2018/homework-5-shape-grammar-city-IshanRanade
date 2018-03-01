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
    let r1: vec3 = vec3.fromValues(0,255,0);
    let r2: vec3 = vec3.fromValues(0,0,255);

    let u = 1.0 - (1/this.radius);

    let platformColor: vec3 = vec3.create();

    let lhs: vec3 = vec3.create();
    vec3.scale(lhs, r1, 1-u);

    let rhs: vec3 = vec3.create();
    vec3.scale(rhs, r2, u);

    vec3.add(platformColor, lhs, rhs);

    vec3.scale(platformColor, platformColor, 1/255.0);

    this.geometry['platform'].add(vec4.fromValues(this.center[0], this.center[1], this.center[2], 1), vec4.fromValues(0,0,0,1), vec4.fromValues(this.radius,this.radius,this.radius,1), vec4.fromValues(platformColor[0], platformColor[1], platformColor[2], 1), vec4.fromValues(0,0,0,0));
  
    let building: Building = new Building(this.geometry, this.seed, this.center, this.up, this.radius/10);
  }
}

export default Unit;