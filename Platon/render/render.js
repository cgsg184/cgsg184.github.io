import { prim, primDraw } from "./prim.js";
import { vec3, mat4, camera, MatrIdentity } from "./mth/mth.js";
export { vec3 };
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Shader not compiled!");
  }

  return shader;
}

export function initGL() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");

  gl.clearColor(0.0, 0.0, 0.0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Code below you may delete for test

  const vs = `#version 300 es
        precision highp float;
        layout(location = 0) in vec3 in_pos;
        layout(location = 1) in vec4 in_color;        
        out vec4 v_color;
        uniform mat4 MatrWVP;
        uniform mat4 MatrW;
        uniform mat4 MatrInv;

        void main() {
            gl_Position = MatrWVP * vec4(in_pos, 1);
            v_color = in_color;
        }
    `;

  const fs = `#version 300 es
        precision highp float;
        out vec4 f_color;
        in vec4 v_color;

        void main() {
            f_color = v_color;
        }
    `;

  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexSh);
  gl.attachShader(shaderProgram, fragmentSh);
  gl.linkProgram(shaderProgram);

  const vBuf = gl.createBuffer();

  let dataBufCube = [
    1, 1, -1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, -1, 1, 1, 0,
    0, 1, 1, 0, 0, 1, -1, -1, 1, 0, 0, 1, 1, 0, 0, -1, 1, 1, 1, 0, 0, 1, -1, 0,
    0, -1, 1, -1, 1, 0, 0, 1, -1, 0, 0, -1, -1, -1, 1, 0, 0, 1, -1, 0, 0, -1,
    -1, 1, 1, 0, 0, 1, -1, 0, 0, -1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1,
    0, 1, 0, 1, 0, 1, 1, -1, 1, 0, 0, 1, 0, 1, 0, -1, 1, -1, 1, 0, 0, 1, 0, 1,
    0, -1, -1, -1, 1, 0, 0, 1, 0, -1, 0, 1, -1, -1, 1, 0, 0, 1, 0, -1, 0, 1, -1,
    1, 1, 0, 1, 1, 0, -1, 0, -1, -1, 1, 1, 0, 0, 1, 0, -1, 0, 1, 1, 1, 1, 0, 0,
    1, 0, 0, 1, -1, 1, 1, 1, 1, 1, 1, 0, 0, 1, -1, -1, 1, 1, 0, 0, 1, 0, 0, 1,
    1, -1, 1, 0, 0, 1, 1, 0, 0, 1, -1, 1, -1, 1, 0, 0, 1, 0, 0, -1, 1, 1, -1, 1,
    0, 0, 1, 0, 0, -1, 1, -1, -1, 1, 0, 0, 1, 0, 0, -1, -1, -1, -1, 1, 0, 1, 1,
    0, 0, -1, 
  ];

  let indCube = [
    0, 1, 2, 
    0, 2, 3, 
    4, 5, 6, 
    4, 6, 7,
    8, 9, 10, 
    8, 10, 11, 
    12, 13, 14, 
    12, 14, 15,
    16, 17, 18, 
    16, 18, 19,
    20, 21, 22,
    20, 22, 23,
  ];

  let dataBuf2 = [
      1, 2, 1, 0, 0, 0, 1, 1, 2, 1,
      0, 1, 2, 0, 0, 0, 1, 0, 1, 2,
      0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
      2, 1, 0, 0, 0, 0, 1, 2, 1, 0,
      2, 1, 2, 0, 0, 0, 1, 2, 1, 2,
      1, 0, 1, 0, 0, 0, 1, 1, 0, 1,
    ];
  
    let ind2 = [
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 1, 4,
      1, 4, 5,
      3, 4, 5,
      2, 3, 5,
      1, 2, 5,
    ];

    let prim1 = prim(gl, dataBufCube, 24, indCube, shaderProgram);
    let prim2 = prim(gl, dataBuf2, 24, ind2, shaderProgram);
    let cam1 = camera();
    //  const dataBuf = [-1, -1, 0, 1, 1, 1, 0, 1,
  //                   -1, 1, 0, 1,  0, 1, 1, 1,
  //                     Math.sqrt(3) / 2, 0, 0, 1, 1, 0, 1, 1];

  const render = () => {
    //    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    //    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataBuf), gl.STATIC_DRAW);

    //    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 8 * 4, 0);
    //    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 8 * 4, 4 * 4);

    //    gl.enableVertexAttribArray(0);
    //    gl.enableVertexAttribArray(1);

    //    gl.useProgram(shaderProgram);

    //    gl.drawArrays(gl.TRIANGLE_STRIP, 0, dataBuf.length / 8);]
    //console.log(prim1);
    gl.enable(gl.DEPTH_TEST);

     primDraw(
      prim1,
      cam1,
      mat4().setRotate(Math.sin(Date.now() / 1000.0), vec3(1, 2, 3))
    );
    // primDraw(
    //   prim2,
    //   cam1,
    //   mat4().setRotate(Math.sin(Date.now() / 1000.0) , vec3(5, 6, 7))
    // );
    window.requestAnimationFrame(render);
  };

  render();
}
