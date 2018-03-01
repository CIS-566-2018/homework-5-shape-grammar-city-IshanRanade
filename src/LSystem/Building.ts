import {vec3, vec4, mat4, mat3, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import LSystem from './LSystem';
import Node from './Node'
import Turtle from './Turtle';
import BuildingPart from '../geometry/OBJGeometry';
import PropertyHolder from "../LSystem/PropertyHolder";

class Building {

  geometry: { [key:string]:PropertyHolder; };
  center: vec3;
  up: vec3;
  radius: number;
  seed: any;

  lSystem: LSystem;

  constructor(geometry: { [key:string]:PropertyHolder; }, seed: any, center: vec3, up: vec3, radius: number) {
    this.geometry = geometry;
    this.center = center;
    this.up = up;
    this.radius = radius;
    this.seed = seed;

    let axiom: string = "FFFF+FFFF+[X]FFFFF+X";
    let grammar : { [key:string]:string; } = {};
    grammar["X"] = "FFF*[+FFF+FFF+FF+FF*X[X[X]]FFFF-FF*X][-FFF+F+FF*X[X[X]]]"

    this.generate();
  }

  generate() {
    let baseX = 1.1;

    let queue = [];
    queue.push({
      'type': 'base',
      'translation': vec3.fromValues(0,0,0),
      'rotation': quat.create(),
      'scale': vec3.fromValues(1,1,1),
      'level': 0
    });

    while(queue.length > 0) {
      let curData = queue.pop();

      if(curData.level < 3) {

        if(curData.type == 'base') {
          let r1: number = this.seed();

          this.add('base', curData.translation, curData.rotation, vec3.fromValues(1,1,1));

          // Add a walkway
          if(r1 < 1.0) {
            let r2 = this.seed();

            let degrees: number = 90 * Math.floor(this.seed() * 360 / 90);

            if(degrees == 180) {
              degrees = 90;
            }

            let prevQuat: quat = quat.create();
            quat.copy(prevQuat, curData.rotation);
            quat.rotateY(prevQuat, prevQuat, degrees * Math.PI / 180);

            let newAim: vec3 = vec3.create();
            vec3.transformQuat(newAim, vec3.fromValues(1,0,0), prevQuat);

            let newTranslation: vec3 = vec3.create();
            vec3.copy(newTranslation, vec3.fromValues(newAim[0], newAim[1], newAim[2]));
            vec3.scale(newTranslation, newTranslation, 3.0 * this.radius);
            vec3.add(newTranslation, newTranslation, curData.translation);

            this.add('walkway', curData.translation, prevQuat, vec3.fromValues(1,1,1));

            queue.push({
              'type': 'base',
              'translation': newTranslation,
              'rotation': prevQuat,
              'scale': vec3.fromValues(1,1,1),
              'aim': vec3.fromValues(newAim[0], newAim[1], newAim[2]),
              'level': curData.level + 1
            });
          }
        } else if(curData.type == "walkway") {
          
        }
      }
    }
  }

  add(type: string, translate: vec3, rotation: quat, scale: vec3) {
    this.geometry[type].add(vec4.fromValues(this.center[0] + translate[0], this.center[1] + translate[1] + this.radius, this.center[2] + translate[2], 1),
                            vec4.fromValues(rotation[0], rotation[1], rotation[2], rotation[3]),
                            vec4.fromValues(this.radius * scale[0], this.radius * scale[1], this.radius * scale[2], 1));
  }
}

export default Building;