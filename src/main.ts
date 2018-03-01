import {vec3,vec4,mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import LSystem from './LSystem/LSystem'
import Rock from './geometry/Rock';
import Building from './LSystem/Building';
import City from './LSystem/Unit';
import OBJGeometry from './geometry/OBJGeometry';
import World from './LSystem/World';

var OBJ = require('webgl-obj-loader');
var meshes: any;
window.onload = function() {
  OBJ.downloadMeshes({
    'tank': 'src/objs/tank.obj',
    'base': 'src/objs/base.obj',
    'door': 'src/objs/door.obj',
    'crater': 'src/objs/crater.obj',
    'road': 'src/objs/road.obj',
    'platform': 'src/objs/platform.obj',
    'dome': 'src/objs/dome.obj',
    'ground': 'src/objs/ground.obj',
    'walkway': 'src/objs/walkway.obj',
    'rover': 'src/objs/rover.obj'
  }, function(m: any) {
    meshes = m;
    main();
  });
}

var seedrandom = require('seedrandom');
let time: number = 1;

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}


let seed: number = 0;
let city: City;

// Drawable geometry
let base: OBJGeometry;
let tank: OBJGeometry;
let door: OBJGeometry;

let world: World;
let types: string[] = ['tank', 'base', 'door', 'crater', 'road', 'platform', 'dome', 'ground', 'walkway', 'rover'];

function loadScene() {
  world = new World(meshes, types, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), seedrandom(seed));
  world.create();

  seed++;
}

function main() {
  
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  //let cameraPos: vec3 = vec3.fromValues(0, 25, -200);
  //vec3.rotateY(cameraPos, cameraPos, vec3.fromValues(0,0,0), 290 * Math.PI / 180.0);
  const camera = new Camera(vec3.fromValues(40,40,40), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0,0,0,1);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const backgroundShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/background-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/background-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    //renderer.render(camera, backgroundShader, [
    //]);
    renderer.render(camera, lambert, world.getOpaqueDrawables(), time);
    renderer.render(camera, lambert, world.getAlphaDrawables(), time);
    
    time++;

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}
