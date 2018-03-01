import PropertyHolder from "./PropertyHolder";
import { vec3, vec4, mat4 } from "gl-matrix";
import OBJGeometry from "../geometry/OBJGeometry";
import Drawable from "../rendering/gl/Drawable";
import Colony from "./Colony";

var kdTree = require('k-d-tree');

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
    mat4.scale(trans['base'], trans['base'], vec3.fromValues(0.45,0.35,0.6));
    trans['door'] = mat4.create();
    trans['crater'] = mat4.create();
    trans['road'] = mat4.create();
    trans['dome'] = mat4.create();
    trans['platform'] = mat4.create();
    mat4.scale(trans['platform'], trans['platform'], vec3.fromValues(0.2,1.0,0.2));
    trans['ground'] = mat4.create();
    trans['walkway'] = mat4.create();
    mat4.scale(trans['walkway'], trans['walkway'], vec3.fromValues(0.5,0.5,0.5));
    trans['rover'] = mat4.create();
    mat4.scale(trans['rover'], trans['rover'], vec3.fromValues(0.5,0.5,0.5));

    // Set the colors for each type of geometry
    let colors: { [key:string]:vec4; } = {};
    colors['tank'] = vec4.fromValues(255,255,255,255.0);
    vec4.scale(colors['tank'], colors['tank'], 1/255.0);
    colors['base'] = vec4.fromValues(255,255,255,255.0);
    vec4.scale(colors['base'], colors['base'], 1/255.0);
    colors['door'] = vec4.fromValues(255,255,255,255.0);
    vec4.scale(colors['door'], colors['door'], 1/255.0);
    colors['crater'] = vec4.fromValues(255,255,255,255.0);
    vec4.scale(colors['crater'], colors['crater'], 1/255.0);
    colors['road'] = vec4.fromValues(208, 216, 229,255.0);
    vec4.scale(colors['road'], colors['road'], 1/255.0);
    colors['dome'] = vec4.fromValues(255,255,255,255.0 * 0.2);
    vec4.scale(colors['dome'], colors['dome'], 1/255.0);
    colors['platform'] = vec4.fromValues(170, 196, 239, 255);
    vec4.scale(colors['platform'], colors['platform'], 1/255.0);
    colors['ground'] = vec4.fromValues(255,255,255,255.0);
    vec4.scale(colors['ground'], colors['ground'], 1/255.0);
    colors['walkway'] = vec4.fromValues(255,255,255,255.0);
    vec4.scale(colors['walkway'], colors['walkway'], 1/255.0);
    colors['rover'] = vec4.fromValues(255,255,255,255.0);
    vec4.scale(colors['rover'], colors['rover'], 1/255.0);

    this.types.forEach(type => {
      this.drawableGeometry[type] = new OBJGeometry(vec3.fromValues(0,0,0), meshes, type, colors[type], trans[type]);
    });



    this.geometry = {};
    this.types.forEach(type => {
      this.geometry[type] = new PropertyHolder();
    });

    this.generate();
  }

  generate() {
    // Add the ground plane
    let groundColor: vec4 = vec4.fromValues(125, 125, 125, 255);
    vec4.scale(groundColor, groundColor, 1/255.0);

    this.geometry['ground'].add(vec4.fromValues(this.center[0], this.center[1] - 1.455, this.center[2], 1),
                                vec4.fromValues(0, 0, 0, 1), 
                                vec4.fromValues(1000,1000,1000,1),
                                groundColor);


    let firstRadius = 10;
    let colony: Colony = new Colony(this.geometry, this.seed, vec3.fromValues(0,0,0), this.up, firstRadius);
    var firstColonyCoord = {
      coordinates: [this.center[0], this.center[1], this.center[2]],
      radius: firstRadius
    };

    let colonies = [];
    colonies.push({
      coordinates: this.center,
      radius: firstRadius
    });

    let iterations: number = 15;
    let maxDistance: number = 180;
    for(let i: number = 0; i < iterations; ++i) {
      let aim: vec3 = vec3.fromValues(1,0,0);
      let degrees: number = this.seed() * 360;
      vec3.rotateY(aim, aim, this.center, degrees * Math.PI / 180);
      let scale: number = this.seed() * maxDistance;
      vec3.scale(aim, aim, scale);
    
      let colonyRadius = firstRadius * (1 - (scale / maxDistance));
      var colonyCoord = {
        coordinates: aim,
        radius: colonyRadius
      };

      let keepGoing: boolean = true;
      colonies.forEach(element => {
        if(vec3.distance(element.coordinates, colonyCoord.coordinates) < 4* element.radius + 4*colonyCoord.radius) {
          keepGoing = false;
        }
      });

      if(!keepGoing) {
        continue;
      }

      colonies.push(colonyCoord);

      let newColony = new Colony(this.geometry, this.seed, aim, this.up, colonyRadius);
    }
  }

  create() {
    this.types.forEach(type => {
      this.drawableGeometry[type].setInstanceProperties(this.geometry[type].translations, this.geometry[type].quaternions, this.geometry[type].scales, this.geometry[type].colors, this.geometry[type].translations.length / 4);
      this.drawableGeometry[type].create();
    });
  }

  getOpaqueDrawables() {
    let drawables: Array<Drawable> = [];
    
    this.types.forEach(type => {
      if(this.drawableGeometry[type].buildingPart != "dome") {
        let drawable: OBJGeometry = this.drawableGeometry[type];
        drawables.push(this.drawableGeometry[type]);
      }
    });

    return drawables;
  }

  getAlphaDrawables() {
    let drawables: Array<Drawable> = [];
    
    this.types.forEach(type => {
      if(this.drawableGeometry[type].buildingPart == "dome") {
        let drawable: OBJGeometry = this.drawableGeometry[type];
        drawables.push(this.drawableGeometry[type]);
      }
    });

    return drawables;
  }

}

export default World;