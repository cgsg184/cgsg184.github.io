import {
  shader,
  _shader,
  ubo,
  _ubo,
  parser,
  _materialPat,
} from "../../all_h.js";

/* GL module */
export class _material {
  /** @type {WebGL2RenderingContext} */
  gl;
  name;

  /** @type {_materialPat} */
  mtlPat;
  tex = [];
  /** @type {_shader} */
  shd;
  /** @type {_ubo} */
  ubo = [];

  constructor(
    /** @type {WebGL2RenderingContext} */ gl,
    name,
    /** @type {_materialPat} */ mtlPat,
    mtlDataStr,
    texDataStr,
    userUbo = null
  ) {
    this.name = name;
    this.gl = gl;
    this.mtlPat = mtlPat;

    let masMtl = [];
    let mtlData = parser(mtlDataStr);

    mtlPat.mForm.args.forEach((patArg) => {
      if (patArg.name === "")
        for (let i = 0; i < patArg.size; i++) masMtl.push(-1);
      else
        for (let i = 0; i < mtlData.args.length; i++) {
          let mtlArg = mtlData.args[i];
          if (mtlArg.name === patArg.name) {
            if (mtlArg.args.length != patArg.size)
              alert("mtl pat len arg not mtl data len");
            for (let i = 0; i < patArg.size; i++)
              masMtl.push(Number(mtlArg.args[i]));
            break;
          }
        }
    });

    this.ubo[0] = ubo(gl, 64, 0, "Matrix");
    this.ubo[1] = ubo(gl, masMtl, 1, "material");
    this.ubo[2] = userUbo;

    this.shd = shader(gl, mtlPat.shdPass);
  }
  apply(/*camera, time*/) {
    this.shd.apply(this.gl);
    //this.ubo[1].apply(this.gl, this.shd);
  }
}

export function material(...arg) {
  return new _material(...arg);
}

