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

    let r = this.radius * 0.8;
    var distance = function(a: any, b: any){
      return Math.sqrt(Math.pow(a.coordinates[0] - b.coordinates[0], 2) +  Math.pow(a.coordinates[1] - b.coordinates[1], 2) + Math.pow(a.coordinates[2] - b.coordinates[2], 2)) - a.radius - r / 5.0;
    }

    let nearestTrees = new kdTree([], distance);

    let unit: Unit = new Unit(this.geometry, this.seed, this.center, this.up, r);

    let queue = [{center: this.center, radius: r / 2, distance: r * 2, level: 0}];
    
    while(queue.length > 0) {
      let curData = queue.pop();

      if(curData.level < 4) {
        let nextColonyAim = vec3.fromValues(1,0,0);
        vec3.scale(nextColonyAim, nextColonyAim, curData.distance);
        vec3.add(nextColonyAim, nextColonyAim, curData.center);

        for(let i: number = 0; i < 5; ++i) {
          let nextColonyPosition: vec3 = vec3.create();
          vec3.rotateY(nextColonyPosition, nextColonyAim, vec3.fromValues(0,0,0), this.seed() * 360);

          var colonyCoord = {
            coordinates: [nextColonyPosition[0], nextColonyPosition[1], nextColonyPosition[2]],
            radius: curData.radius
          };

          var nearest = nearestTrees.nearest(colonyCoord, 1);
          if((nearest.length > 0 && nearest[0][1] < curData.radius) || 
              (vec3.distance(nextColonyPosition, this.center)) + curData.radius > this.radius * 4) {
            continue;
          }

          nearestTrees.insert(colonyCoord);
          let unit: Unit = new Unit(this.geometry, this.seed, nextColonyPosition, this.up, curData.radius);

          queue.push({center: vec3.fromValues(nextColonyPosition[0], nextColonyPosition[1], nextColonyPosition[2]),
                      radius: curData.radius * 0.8,
                      distance: curData.distance * 0.5,
                      level: curData.level + 1});
        }
      }
    }
  }
}

export default Colony;