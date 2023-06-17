import {
  vec3,
  buffer,
  _buffer,
  _material,
  _mat4,
  getTextFromFile,
} from "../all_h.js";

function getNormals(V, I, N) {
  for (let i = 0; i < V.length; i++) N.push(vec3(0));
  for (let i = 0; i < I.length - 2; i += 3) {
    const p0 = vec3(V[I[i]].x, V[I[i]].y, V[I[i]].z);
    const p1 = vec3(V[I[i + 1]].x, V[I[i + 1]].y, V[I[i + 1]].z);
    const p2 = vec3(V[I[i + 2]].x, V[I[i + 2]].y, V[I[i + 2]].z);
    var n = p1.sub(p0).cross(p2.sub(p0)).norm();
    N[I[i]].add(n);
    N[I[i + 1]].add(n);
    N[I[i + 2]].add(n);
  }
  for (let i = 0; i < N.length; i++) N[i] = N[i].norm();
}

function getVB(figure) {
  var VB = figure.VB;
  var V = figure.V;
  var I = figure.I;
  var N = figure.N;
  var C = figure.C;

  getNormals(V, I, N);

  for (let i = 0; i < V.length; i++) {
    VB.push(...V[i].add(C).toArrayV(), ...N[i].toArrayV());
  }
}

let admisName = [];
admisName["P"] = ["in_pos", "Position"];
admisName["N"] = ["in_norm", "Normal"];
admisName["T"] = ["in_tex", "Texture"];
admisName["C"] = ["in_color", "Color"];

/* Primitive module */
export class _prim {
  isCreated;
  isDelete;
  isDraw;

  type;
  /** @type {_mat4} */
  mTrans;
  /** @type {_material} */
  mtl;
  /** @type {_buffer} */
  VA;
  /** @type {_buffer} */
  VB;
  /** @type {_buffer} */
  IB;
  numOfV;

  create(
    /** @type {WebGL2RenderingContext} */ gl,
    type,
    /** @type {_buffer} */ V,
    /** @type {_buffer} */ I,
    /**@type {_material}*/ mtl
  ) {
    /* Saved */
    this.isCreated = false;
    this.isDelete = false;
    this.isDraw = false;
    if (type == "triangle strip") this.type = gl.TRIANGLE_STRIP;
    else if (type == "triangle") this.type = gl.TRIANGLES;
    else this.type = gl.POINTS;

    this.mtl = mtl;
    /* this.VA = this.VB = this.VI = null; */

    if (typeof mtl.shd.program.then == typeof Promise)
      mtl.shd.program.then(() => {
        this.loadV(gl, V, I, mtl);
        this.isCreated = true;
      });
    else {
      this.loadV(gl, V, I, mtl);
      this.isCreated = true;
    }
  }
  draw(mTrans) {
    this.isDraw = true;
    this.mTrans = mTrans;
  }
  del() {
    if (this.isCreated != true) this.isDelete = false;
  }

  loadV(
    /** @type {WebGL2RenderingContext} */ gl,
    /** @type {_buffer} */ V,
    /** @type {_buffer} */ I,
    /**@type {_material}*/ mtl
  ) {
    if (I == undefined || I == null) this.numOfV = V.length / 3;
    else this.numOfV = I.length;

    /* VA & VB */
    this.VA = gl.createVertexArray();
    gl.bindVertexArray(this.VA);

    this.VB = buffer(gl, gl.ARRAY_BUFFER, new Float32Array(V));

    if (I != null && I != undefined)
      /* index */
      this.IB = buffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Int16Array(I));

    let off = 0;
    for (let i = 0; i < mtl.mtlPat.vForm.len; i++) {
      for (
        let j = 0;
        j < admisName[mtl.mtlPat.vForm.args[i].name].length;
        j++
      ) {
        const name = admisName[mtl.mtlPat.vForm.args[i].name][j];
        // console.log(name);
        if (mtl.shd.attrs[name] != undefined) {
          const loc = mtl.shd.attrs[name].loc;
          gl.vertexAttribPointer(
            loc,
            mtl.mtlPat.vForm.args[i].size,
            gl.FLOAT,
            false,
            mtl.mtlPat.vFormAllSize * 4,
            off
          );
          off += mtl.mtlPat.vForm.args[i].size * 4;
          gl.enableVertexAttribArray(loc);
          break;
        }
        alert("_shader have no pos but _materialPat have");
      }
    }
  }

  objLoad(gl, filename, type, mtl) {
    return getTextFromFile(filename).then((text) => {
      if (text == undefined || text == null || text == "") return;
      const data = text.replace("\r").split("\n");
      const V = [],
        I = [],
        VB = [],
        N = [];
      let ilength = 0;
      for (let i = 0; i < data.length; i++) {
        if ("f " === data[i].slice(0, 2)) ilength++;
      }
      for (let i = 0; i < data.length; i++) {
        if ("v " === data[i].slice(0, 2)) {
          let tmp = data[i].split(" ");
          V.push(vec3(Number(tmp[1]), Number(tmp[2]), Number(tmp[3])));
        } else if ("f " === data[i].slice(0, 2)) {
          let tmp = data[i].split(" ");
          for (let j = 1; j < tmp.length; j++) {
            let ind = Number(tmp[j].split("//")[0]);
            if (ind > 0) I.push(ind - 1);
            else I.push(ilength + ind);
          }
        }
      }
      var obj = { V: V, I: I, VB: VB, N: N, C: vec3(0) };
      getVB(obj);

      this.create(gl, type, obj.VB, obj.I, mtl);
    });
  }
}

export function prim(...arg) {
  return new _prim(...arg);
}
