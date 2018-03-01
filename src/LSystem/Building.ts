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
      'translation': vec3.fromValues(0,this.radius * 0.4,0),
      'rotation': quat.create(),
      'scale': vec3.fromValues(1,1,1),
      'aim': vec3.fromValues(1,0,0),
      'level': 0
    });

    while(queue.length > 0) {
      let curData = queue.pop();

      if(curData.level < 5) {

        if(curData.type == 'base') {
          let r1: number = this.seed();

          this.add('base', curData.translation, quat.create(), vec3.fromValues(1,1,1));

          // Add a walkway
          if(r1 < 1.0) {
            let r2 = this.seed();

            let degrees: number = 90 * Math.floor((r2 * 360) / 90);

            if(degrees == 180) {
              degrees = 90;
            }

            let newTranslation: vec3 = vec3.create();
            vec3.copy(newTranslation, curData.aim);
            vec3.scale(newTranslation, newTranslation, 1.1 * this.radius);
            vec3.add(newTranslation, newTranslation, curData.translation);
            
            let prevQuat: quat = quat.create();
            quat.copy(prevQuat, curData.rotation);
            quat.rotateY(prevQuat, prevQuat, degrees * Math.PI / 180);

            let trans: mat4 = mat4.create();
            mat4.fromQuat(trans, prevQuat);
            let newAim = vec4.fromValues(curData.aim[0], curData.aim[1], curData.aim[2], 0);
            vec4.transformMat4(newAim, newAim, trans);

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
        }
      }
    }

    //this.add('base', vec3.fromValues(0,0,0), vec4.fromValues(0,0,0,1), vec3.fromValues(1,1,1));
    //this.add('door', vec3.fromValues(0,0,-baseX * this.radius), vec4.fromValues(0,0,0,1), vec3.fromValues(1,1,1));
    //this.geometry['base'].add(vec4.fromValues(this.center[0],this.center[1] + this.radius,this.center[2],1), vec4.fromValues(0,0,0,1), vec4.fromValues(this.radius,this.radius,this.radius,1));
    //this.geometry['door'].add(vec4.fromValues(this.center[0],this.center[1] + this.radius,this.center[2] - 1.1 * this.radius,1), vec4.fromValues(0,0,0,1), vec4.fromValues(this.radius,this.radius,this.radius,1));

    //this.turtle = new Turtle(this.originTranslation, this.originAim, this.originScale)
  }

  add(type: string, translate: vec3, rotation: quat, scale: vec3) {
    this.geometry[type].add(vec4.fromValues(this.center[0] + translate[0], this.center[1] + translate[1] + this.radius, this.center[2] + translate[2], 1),
                            vec4.fromValues(rotation[0], rotation[1], rotation[2], rotation[3]),
                            vec4.fromValues(this.radius * scale[0], this.radius * scale[2], this.radius * scale[2], 1));
    //this.geometry['door'].add(vec4.fromValues(this.center[0],this.center[1] + this.radius,this.center[2],1), vec4.fromValues(0,0,0,1), vec4.fromValues(this.radius,this.radius,this.radius,1));
    //this.geometry['base'].add(vec4.fromValues(this.center[0],this.center[1] + this.radius,this.center[2],1), vec4.fromValues(0,0,0,1), vec4.fromValues(this.radius,this.radius,this.radius,1));
  }
}

export default Building;