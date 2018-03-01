import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufCol: WebGLBuffer;

  bufTranslations: WebGLBuffer;
  bufQuaternions: WebGLBuffer;
  bufScales: WebGLBuffer;
  bufInstanceColors: WebGLBuffer;
  bufInstanceIds: WebGLBuffer;

  idxBound: boolean = false;
  posBound: boolean = false;
  norBound: boolean = false;
  colBound: boolean = false;

  translationsBound: boolean = false;
  quaternionsBound: boolean = false;
  scalesBound: boolean = false;
  instanceColorsBound: boolean = false;
  instanceIdsBound: boolean = false;

  isInstanced: boolean = false;
  instances: number = 0;

  abstract create() : void;

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufCol);
    gl.deleteBuffer(this.bufTranslations);
    gl.deleteBuffer(this.bufQuaternions);
    gl.deleteBuffer(this.bufScales);
    gl.deleteBuffer(this.bufInstanceColors);
    gl.deleteBuffer(this.bufInstanceIds);
  }

  generateIdx() {
    this.idxBound = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posBound = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norBound = true;
    this.bufNor = gl.createBuffer();
  }

  generateCol() {
    this.colBound = true;
    this.bufCol = gl.createBuffer();
  }

  generateTranslations() {
    this.translationsBound = true;
    this.bufTranslations = gl.createBuffer();
  }

  generateQuaternions() {
    this.quaternionsBound = true;
    this.bufQuaternions = gl.createBuffer();
  }

  generateScales() {
    this.scalesBound = true;
    this.bufScales = gl.createBuffer();
  }

  generateInstanceColors() {
    this.instanceColorsBound = true;
    this.bufInstanceColors = gl.createBuffer();
  }

  generateInstanceIds() {
    this.instanceIdsBound = true;
    this.bufInstanceIds = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxBound) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxBound;
  }

  bindPos(): boolean {
    if (this.posBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posBound;
  }

  bindNor(): boolean {
    if (this.norBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norBound;
  }

  bindCol(): boolean {
    if (this.colBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colBound;
  }

  bindTranslations(): boolean {
    if (this.translationsBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslations);
    }

    return this.translationsBound;
  }

  bindQuaternions(): boolean {
    if (this.quaternionsBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufQuaternions);
    }

    return this.quaternionsBound;
  }

  bindScales(): boolean {
    if (this.scalesBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufScales);
    }

    return this.scalesBound;
  }

  bindInstanceColors(): boolean {
    if (this.instanceColorsBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufInstanceColors);
    }

    return this.instanceColorsBound;
  }

  bindInstanceIds(): boolean {
    if (this.instanceIdsBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufInstanceIds);
    }

    return this.instanceIdsBound;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }
};

export default Drawable;
