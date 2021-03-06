import { vec4 } from "gl-matrix";

class PropertyHolder {
  translations: number[];
  quaternions: number[];
  scales: number[];
  colors: number[];
  ids: number[];

  constructor() {
    this.translations = [];
    this.quaternions = [];
    this.scales = [];
    this.colors = [];
    this.ids = [];
  }

  add(translation: vec4, quaternion: vec4, scale: vec4, color: vec4, id: vec4) {
    this.translations.push(translation[0], translation[1], translation[2], translation[3]);
    this.quaternions.push(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
    this.scales.push(scale[0], scale[1], scale[2], scale[3]);
    this.colors.push(color[0], color[1], color[2], color[3]);
    this.ids.push(id[0], id[1], id[2], id[3]);
  }

  addMultiple(translations: number[], quaternions: number[], scales: number[], colors: number[], id: number[]) {
    translations.forEach(element => {
      this.translations.push(element);
    });
    quaternions.forEach(element => {
      this.quaternions.push(element);
    });
    scales.forEach(element => {
      this.scales.push(element);
    });
    colors.forEach(element => {
      this.colors.push(element);
    });
    id.forEach(element => {
      this.ids.push(element);
    });
  }
}

export default PropertyHolder;