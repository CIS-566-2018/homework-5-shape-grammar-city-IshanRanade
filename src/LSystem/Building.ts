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

  static id: number = 1;

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
      'level': 0,
      'floor': 0
    });

    let maxIterations: number = 6;
    while(queue.length > 0) {
      let curData = queue.pop();

      if(curData.level < maxIterations) {

        if(curData.type == 'base') {
          let r1: number = this.seed();

          if(r1 < 0.5) {
            this.add('base', curData.translation, curData.rotation, vec3.fromValues(1,1,1), this.radius, this.radius * curData.level);
          } else {
            this.add('tank', curData.translation, curData.rotation, vec3.fromValues(1,1,1), this.radius, this.radius * curData.level);
          }

          // Add a walkway
          if(r1 < 0.9) {
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
            vec3.copy(newTranslation, newAim);
            vec3.scale(newTranslation, newTranslation, 3.0 * this.radius);
            vec3.add(newTranslation, newTranslation, curData.translation);

            if(curData.level + 1 < maxIterations) {
              this.add('walkway', curData.translation, prevQuat, vec3.fromValues(1,1,1), this.radius, this.radius * curData.level);
            }

            queue.push({
              'type': 'base',
              'translation': newTranslation,
              'rotation': prevQuat,
              'scale': vec3.fromValues(1,1,1),
              'level': curData.level + 1,
              'floor': curData.floor + 1
            });

            queue.push({
              'type': 'base',
              'translation': vec3.fromValues(newTranslation[0], newTranslation[1] + 1.0 * this.radius, newTranslation[2]),
              'rotation': quat.fromValues(prevQuat[0], prevQuat[1], prevQuat[2], prevQuat[3]),
              'scale': vec3.fromValues(1,1,1),
              'level': curData.level + 1,
              'floor': curData.floor
            });

            let walkWayTranslation: vec3 = vec3.create();
            vec3.copy(walkWayTranslation, newAim);
            vec3.scale(walkWayTranslation, newTranslation, 1.5 * this.radius);
            vec3.add(walkWayTranslation, walkWayTranslation, curData.translation);

            let walkwayQuat = quat.create();
            quat.copy(walkwayQuat, prevQuat);

            queue.push({
              'type': 'walkway',
              'translation': walkWayTranslation,
              'rotation': walkwayQuat,
              'scale': vec3.fromValues(1,1,1),
              'level': curData.level + 1,
              'floor': -1
            });
          }
        } else if(curData.type == "walkway") {
          if(true) {
            let r2 = this.seed();

            if(r2 < 0.2) {
              let degrees: number = 90;

              // if(r2 < 0.5) {
              //   degrees = 90;
              // } else {
              //   degrees = -90;
              // }

              let prevQuat: quat = quat.create();
              quat.copy(prevQuat, curData.rotation);
              quat.rotateY(prevQuat, prevQuat, degrees * Math.PI / 180);

              let newAim: vec3 = vec3.create();
              vec3.transformQuat(newAim, vec3.fromValues(1,0,0), prevQuat);

              let newTranslation: vec3 = vec3.create();
              vec3.copy(newTranslation, newAim);
              vec3.scale(newTranslation, newTranslation, 2.0 * this.radius);
              vec3.add(newTranslation, newTranslation, curData.translation);
              newTranslation[1] += this.radius * 50;

              this.add('rover', newTranslation, prevQuat, vec3.fromValues(1,1,1), this.radius, this.radius * curData.level);
            }

            // queue.push({
            //   'type': 'base',
            //   'translation': newTranslation,
            //   'rotation': prevQuat,
            //   'scale': vec3.fromValues(1,1,1),
            //   'aim': vec3.fromValues(newAim[0], newAim[1], newAim[2]),
            //   'level': curData.level + 1
            // });
          }
        }
      }
    }
  }

  add(type: string, translate: vec3, rotation: quat, scale: vec3, globalR: number, r: number) {
    let r1: vec3 = vec3.create();
    let r2: vec3 = vec3.create();

    if(type == "base") {
      r1 = vec3.fromValues(255,0,0);
      r2 = vec3.fromValues(0,255,0);
    } else if(type == "walkway") {
      r1 = vec3.fromValues(255,0,0);
      r2 = vec3.fromValues(0,255,0);
    } else if(type == "rover") {
      r1 = vec3.fromValues(255,0,0);
      r2 = vec3.fromValues(0,255,0);
    } else {
      r1 = vec3.fromValues(255,0,0);
      r2 = vec3.fromValues(0,255,0);
    }

    let u = 1.0 - (1/globalR/10);

    let color: vec3 = vec3.create();

    let lhs: vec3 = vec3.create();
    vec3.scale(lhs, r1, 1-u);

    let rhs: vec3 = vec3.create();
    vec3.scale(rhs, r2, u);

    vec3.add(color, lhs, rhs);

    vec3.scale(color, color, 1/255.0);


    let localr1: vec3 = vec3.fromValues(255,255,255);
    let localr2: vec3 = vec3.fromValues(0,0,0);

    let localu = 1.0 - (r/100000);

    let locallhs: vec3 = vec3.create();
    vec3.scale(locallhs, localr1, 1-localu);

    let localrhs: vec3 = vec3.create();
    vec3.scale(localrhs, localr2, localu);

    let localColor: vec3 = vec3.create();
    vec3.add(localColor, locallhs, localrhs);

    let finalColor: vec3 = vec3.create();
    vec3.add(finalColor, localColor, color);
    vec3.scale(finalColor, finalColor, 0.5);

    let thisId: number;

    if(type == "rover") {
      thisId = Building.id;
      Building.id += 1;
    } else {
      thisId = 0;
    }

    this.geometry[type].add(vec4.fromValues(this.center[0] + translate[0], this.center[1] + translate[1] + this.radius, this.center[2] + translate[2], 1),
                            vec4.fromValues(rotation[0], rotation[1], rotation[2], rotation[3]),
                            vec4.fromValues(this.radius * scale[0], this.radius * scale[1], this.radius * scale[2], 1),
                            vec4.fromValues(finalColor[0], finalColor[1], finalColor[2], 1),
                            vec4.fromValues(thisId, thisId, thisId, thisId));
  }
}

export default Building;