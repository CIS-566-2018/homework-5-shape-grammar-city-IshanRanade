import Building from "./Building";
import { vec3, vec4 } from "gl-matrix";
import PropertyHolder from "../LSystem/PropertyHolder";

class City {

  center: vec3;
  seed: any;
  meshes: any;
  up: vec3;

  geometry: { [key:string]:PropertyHolder; };

  constructor(types: string[], center: vec3, seedRandom: any, meshes: any, up: vec3) {
    this.center = center;
    this.seed = seedRandom;
    this.meshes = meshes;
    this.up = up;
    this.geometry = {};
    
    types.forEach(type => {
      this.geometry[type] = new PropertyHolder();
    });
  }

  generate() {
    let building: Building = new Building(this.meshes, vec3.fromValues(0,0,0), vec3.fromValues(0,0,1), vec3.fromValues(1,1,1), this.up);
    this.addBuilding(building);
  }

  createBuilding() {

  }

  addBuilding(building: Building) {
    for(let partName in building.buildingParts) {
      this.geometry[partName].addMultiple(building.buildingParts[partName].translations,
                                          building.buildingParts[partName].quaternions,
                                          building.buildingParts[partName].scales);
    }
  }
}

export default City;