import { vec3, vec4 } from "gl-matrix";
import PropertyHolder from "./PropertyHolder";
import Unit from "./Unit";

var kdTree = require('k-d-tree');

class Colony {

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
    this.geometry['crater'].add(vec4.fromValues(0,0,0,0), vec4.fromValues(0,0,0,1), vec4.fromValues(this.radius,this.radius,this.radius,this.radius));

    let r = this.radius;
    var distance = function(a: any, b: any){
      return Math.sqrt(Math.pow(a.coordinates[0] - b.coordinates[0], 2) +  Math.pow(a.coordinates[1] - b.coordinates[1], 2) + Math.pow(a.coordinates[2] - b.coordinates[2], 2)) - a.radius - r / 5.0;
    }

    let nearestTrees = new kdTree([], distance);

    let unit: Unit = new Unit(this.geometry, this.seed, this.center, this.up, this.radius);

    let queue = [this.center];

    let startDistance: number = this.radius * 2;

    let curRadius: number = this.radius / 2;
    while(queue.length > 0) {
      let curPosition: vec3 = queue.pop();
      let nextColonyAim = vec3.fromValues(1,0,0);
      vec3.scale(nextColonyAim, nextColonyAim, startDistance);
      vec3.add(nextColonyAim, nextColonyAim, curPosition);

      for(let i: number = 0; i < 20; ++i) {
        let nextColonyPosition: vec3 = vec3.create();
        vec3.rotateY(nextColonyPosition, nextColonyAim, vec3.fromValues(0,0,0), this.seed() * 360);

        var colonyCoord = {
          coordinates: [nextColonyPosition[0], nextColonyPosition[1], nextColonyPosition[2]],
          radius: curRadius
        };

        var nearest = nearestTrees.nearest(colonyCoord, 1);

        if(nearest.length > 0 && nearest[0][1] < curRadius) {
          continue;
        }

        nearestTrees.insert(colonyCoord);
        let unit: Unit = new Unit(this.geometry, this.seed, nextColonyPosition, this.up, this.radius);
      }
    }
    //let unit: Unit = new Unit(this.geometry, this.seed, this.center, this.up, this.radius);
  }
}

export default Colony;