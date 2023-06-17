import { glContext, _glContext } from "./gl/gl.js";
import { mat4, _mat4 } from "./math/mat4.js";
import { vec3, _vec3 } from "./math/vec3.js";
import { input, _input } from "./render/input/input.js";
import { buffer, ubo, _buffer, _ubo } from "./render/material/buffer.js";
import { material, _material } from "./render/material/material.js";
import { materialPat, _materialPat } from "./render/material/materialPat.js";
import { shader, _shader } from "./render/material/shader.js";
import { camera, _camera } from "./render/camera.js";
import { prim, _prim } from "./render/prim.js";
import { render, _render } from "./render/render.js";
import { timer, _timer } from "./render/timer.js";
import { parser } from "./tools/parser.js";
import { getTextFromFile } from "./tools/textload.js";
import { system, _system } from "./main.js";

export {
  glContext,
  _glContext,
  mat4,
  _mat4,
  vec3,
  _vec3,
  input,
  _input,
  buffer,
  _buffer,
  ubo,
  _ubo,
  material,
  _material,
  materialPat,
  _materialPat,
  shader,
  _shader,
  camera,
  _camera,
  prim,
  _prim,
  render,
  _render,
  timer,
  _timer,
  parser,
  getTextFromFile,
  system,
  _system,
};
