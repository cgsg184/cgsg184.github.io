import {
  mat4,
  _mat4,
  prim,
  timer,
  camera,
  input,
  materialPat,
  material,
  _timer,
  _camera,
  _buffer,
  _material,
  _glContext,
  _prim,
  getTextFromFile,
} from "../all_h.js";

/* Render module */
export class _render {
  static allPrims = [];
  /** @type {WebGL2RenderingContext} */
  gl;

  /** @type {_timer} */
  timer;
  /** @type {_camera} */
  camera;
  /** @type {_timer} */
  input;

  constructor(/** @type {_glContext}*/ drawContext) {
    this.gl = drawContext.gl;

    this.camera = camera(drawContext.gl);
    this.timer = timer();
    this.input = input(drawContext.canvas);

    this.colorSet(0.3, 0.47, 0.8, 1);
  }
  mtlpatCreate(...arg) {
    return materialPat(...arg);
  }

  mtlCreate(...arg) {
    return material(this.gl, ...arg);
  }

  primCreate(
    type,
    /** @type {_buffer} */ V,
    /** @type {_buffer} */ I,
    /** @type {_material} */ mtl
  ) {
    const pr = prim.create(this.gl, type, V, I, mtl);

    _render.allPrims.push(pr);

    return pr;
  }

  colorSet(r, g, b, a) {
    this.gl.clearColor(r, g, b, a);
  }
  start() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  prim() {
    const pr = prim();

    _render.allPrims.push(pr);

    return pr;
  }

  primDraw(/** @type {_prim} */ prim) {
    prim.mtl.apply(this.camera, this.timer);

    /* Matr UBO */
    prim.mtl.ubo[0].update(
      this.gl,
      new Float32Array([
        ...mat4().matrMulmatr(prim.mTrans, this.camera.matrVP).toArrayM(),
        ...this.camera.matrVP.toArrayM(),
        ...mat4().ortho(-1, 1, -1, 1, -1, 1).toArrayM(),
        ...this.camera.loc.toArray4(),
        ...this.camera.at.toArray4(),
        ...this.camera.up.toArray4(),
        ...this.camera.right.toArray4(),
        this.timer,
        0,
        0,
        0,
      ])
    );
    prim.mtl.ubo[0].apply(this.gl, prim.mtl.shd.program, 0);

    this.gl.bindVertexArray(prim.VA);
    if (prim.IB != undefined) {
      prim.IB.apply(this.gl);
      this.gl.drawElements(prim.type, prim.numOfV, this.gl.UNSIGNED_SHORT, 0);
    } else this.gl.drawArrays(prim.type, 0, prim.numOfV);
  }

  end() {
    this.timer.response("fps");

    _render.allPrims.forEach((prim, ind) => {
      if (
        prim.isDraw === true &&
        prim.isDelete === false &&
        prim.isCreated === true
      ) {
        /* UBO and uniforms */
        this.primDraw(prim);
      } else if (prim.isDelete === true && prim.isCreated === true) {
        this.allPrims.splice(ind, 1);
      }
    });
  }
}

export function render(...arg) {
  return new _render(...arg);
}
