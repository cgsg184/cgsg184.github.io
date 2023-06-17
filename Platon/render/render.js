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

function cliked(id) {
  var t = document.getElementById(id);
  if (t.checked) {
      return true; 
    } else {
        return false;
    }
}

export function initGL() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");

  gl.clearColor(0.5, 0.0, 0.5, 1);
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
    uniform highp float Time;

    void main() {
        gl_Position = MatrWVP * vec4(in_pos, 1);
        v_color.x = in_pos.x * 0.47 * cos(Time / 1000.0) + 0.3;
        v_color.y = in_pos.y * 0.70 * sin(Time / 1350.0) + 0.3;
        v_color.z = in_pos.z * 0.28 * cos(Time / 850.0) + 0.28;
        v_color.a = 0.50;
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
      -1, -1, 1, -1, 1, -1, 1, 1, -1, -1, 
      -1, 1, 1, 1, -1, -1, 1, 1, -1, -1, 
      1, 1, 1, -1, -1, 1, 1, 1, -1, -1, 
      1, -1, 1, 1, 1, -1, 1, 1, -1, -1, 
      1, -1, 1, 1, -1, 1, 1, -1, -1, -1,
      1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 
      1, 1, -1, 1, -1, -1, 1, -1, -1, -1, 
      1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 
      1, -1, -1, 1, -1, 1, 1, -1, 1, -1, 
      -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, 
      -1, 1, -1, 1, 1, -1, 1, -1, 1, -1, 
      1, 1, -1, 1, 1, -1, -1, -1, 1, -1, 
      -1, -1, -1, 1, -1, -1, 1, -1, -1, -1, 
      -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 
      -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 
      -1, 1, -1, 1, -1, -1, 1, -1, -1, -1, 
      -1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 
      -1, 1, -1, 1, 1, 1, 1, -1, -1, 1, 
      1, 1, -1, 1, -1, -1, 1, -1, -1, 1, 
      1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 
      -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 
      -1, -1, -1, 1, -1, -1, 1, -1, -1, -1, 
      1, -1, -1, 1, -1, -1, 1, -1, -1, -1, 
      1, -1, 1, 1, -1, 1, 1, -1, -1, -1,
    ];
  
    let indCube = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
      15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ];
  
    let dataBufIcosahedron = [
      0, -1, 0, 0, 1, 0, 1, 1, 0, 0, -0.276, -0.447, -0.851, 1, 0, 0, 1, 1, 0, 0,
      0.724, -0.447, -0.526, 1, 1, 0, 1, 1, 0, 0, 0.724, -0.447, 0.526, 1, 0, 0,
      1, -1, 0, 0, -0.276, -0.447, 0.851, 0, 1, 0, 1, -1, 0, 0, -0.894, -0.447, 0,
      1, 1, 0.4, 1, 0, 1, 0, -0.724, 0.447, 0.526, 1, 1, 0.5, 0.4, 0, 1, 0,
      -0.724, 0.447, -0.526, 0, 0, 1, 1, 1, 0, 0, 0.276, 0.447, -0.851, 1, 0, 1,
      1, -1, 0, 0, 0.894, 0.447, 0, 0, 1, 1, 1, -1, 0, 0, 0.276, 0.447, 0.851, 1,
      0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0.5, 1, 0.3, 0, 1, 0,
    ];
  
    let indIcosahedron = [
      0, 1, 2, 0, 1, 5, 0, 4, 5, 0, 3, 4, 0, 2, 3, 6, 10, 11, 6, 7, 11, 7, 8, 11,
      8, 9, 11, 9, 10, 11, 2, 3, 9, 1, 2, 8, 1, 5, 7, 4, 5, 6, 3, 4, 10, 4, 6, 10,
      5, 6, 7, 1, 7, 8, 2, 8, 9, 3, 9, 10,
    ];
  
    let dataBufOktahedron = [
      0, 1, 0, 0, 0, 0, 1, 1, 2, 1, 
      -1, 0, 1, 0, 0, 0, 1, 0, 1, 2,
      -1, 0, -1, 0, 0, 0, 1, 0, 1, 0, 
      1, 0, -1, 0, 0, 0, 1, 2, 1, 0, 
      1, 0, 1, 0, 0, 0, 1, 2, 1, 2,
      0, -1, 0, 0, 0, 0, 1, 1, 0, 1,
    ];
  
    let indOktahedron = [
      0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 1, 4, 1, 4, 5, 3, 4, 5, 2, 3, 5, 1, 2, 5,
    ];
  
    let dataBufTetrahedron = [
      0, 1, 0, -1, -1, -1, 0, 0, 1, 0, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, 1, -1, -1, -1, -1,
      -1, 0, 1, -1, -1, 0, -1, 1, -1, -1, -1, 0, 0, -1, 1,
    ];
  
    let dataBufDodecahedron = [
      0.149, -0.631, -0.459, 0, 1, 0, 1, 1, 0, 0, -0.39, -0.631, -0.284, 1, 0, 0,
      1, 1, 0, 0, -0.39, -0.631, 0.284, 1, 1, 0, 1, 1, 0, 0, 0.149, -0.631, 0.459,
      1, 0, 0, 1, -1, 0, 0, 0.483, -0.631, 0, 0, 1, 0, 1, -1, 0, 0, -0.149, 0.631,
      0.459, 1, 1, 0.4, 1, 0, 1, 0, -0.483, 0.631, 0, 1, 1, 0.5, 0.4, 0, 1, 0,
      -0.149, 0.631, -0.459, 0, 0, 0, 1, 0, 1, 0, 0.39, 0.631, -0.284, 0, 0, 0, 1,
      0, 1, 0, 0.39, 0.631, 0.284, 0, 0, 0, 1, 0, 1, 0, 0.781, -0.149, 0, 0, 0, 0,
      1, 0, 1, 0, 0.241, -0.149, -0.743, 0, 0, 0, 1, 0, 1, 0, -0.631, -0.149,
      -0.459, 0, 0, 0, 1, 0, 1, 0, -0.631, -0.149, 0.459, 0, 0, 0, 1, 0, 1, 0,
      0.241, -0.149, 0.743, 0, 0, 0, 1, 0, 1, 0, -0.241, 0.149, 0.743, 0, 0, 0, 1,
      0, 1, 0, -0.781, 0.149, 0, 0, 0, 0, 1, 0, 1, 0, -0.241, 0.149, -0.743, 0, 0,
      0, 1, 0, 1, 0, 0.631, 0.149, -0.459, 0, 0, 0, 1, 0, 1, 0, 0.631, 0.149,
      0.459, 0, 0, 0, 1, 0, 1, 0,
    ];
  
    let indDodecahedron = [
      0, 1, 2, 0, 2, 3, 0, 3, 4, 5, 6, 7, 5, 7, 9, 7, 8, 9, 5, 9, 15, 9, 14, 15,
      9, 14, 19, 2, 13, 15, 2, 3, 15, 3, 14, 15, 5, 6, 15, 6, 15, 16, 13, 15, 16,
      3, 4, 14, 4, 14, 19, 4, 10, 19, 1, 2, 13, 1, 12, 13, 12, 13, 16, 7, 8, 17,
      8, 11, 17, 8, 11, 18, 10, 11, 18, 4, 10, 11, 0, 4, 11, 8, 9, 19, 8, 18, 19,
      10, 18, 19, 0, 1, 11, 1, 11, 17, 1, 12, 17, 12, 16, 17, 6, 16, 17, 6, 7, 17,
    ];
  
    let indTetrahedron = [0, 1, 2, 0, 2, 3, 0, 1, 3, 1, 2, 3];
  
      let prim1 = prim(gl, dataBufCube, 24, indCube, shaderProgram);
      //let prim2 = prim(gl, dataBuf2, 4, ind2, shaderProgram);
      let cam1 = camera();
      
  //  const dataBuf = [-1, -1, 0, 1, 1, 1, 0, 1,
  //                   -1, 1, 0, 1,  0, 1, 1, 1,
  //                     Math.sqrt(3) / 2, 0, 0, 1, 1, 0, 1, 1];

  const render = () => {
    let smth;
    if (cliked("Cube"))
    {
        smth = prim(gl, dataBufCube, 24, indCube, shaderProgram);
        // primDraw(
        //   cube, cam1,
        //   mat4().setRotate(Math.sin(Date.now() / 1000.0), vec3(5, 5, 5)),      
        //   );
    }
    else if (cliked("Icosahedron"))
    {
        smth = prim(gl, dataBufIcosahedron, 12, indIcosahedron, shaderProgram);
        // primDraw(
        //   smth,
        //   cam1,
        //   mat4().setRotate(Math.sin(Date.now() / 1000.0), vec3(1, 2, 3)),      
        //   );
    }
    else if (cliked("Tetrahedron"))
    {
        smth = prim(gl, dataBufTetrahedron, 4, indTetrahedron, shaderProgram);
        // primDraw(
        //   smth,
        //   cam1,
        //   mat4().setRotate(Math.sin(Date.now() / 1000.0), vec3(1, 2, 3)),      
        //   );
    }
    else if (cliked("Octahedron"))
    {
        smth = prim(gl, dataBufOktahedron, 8, indOktahedron, shaderProgram);
        // primDraw(
        //   smth,
        //   cam1,
        //   mat4().setRotate(Math.sin(Date.now() / 1000.0), vec3(1, 2, 3)),      
        //   );
    }
    else if (cliked("Dodecahedron"))
    {
        smth = prim(gl, dataBufDodecahedron, 20, indDodecahedron, shaderProgram);
        // primDraw(
        //   smth,
        //   cam1,
        //   mat4().setRotate(Math.sin(Date.now() / 1000.0), vec3(1, 2, 3)),      
        //   );
    }

    gl.enable(gl.DEPTH_TEST);
    primDraw(
      smth,
      cam1,
      mat4().setRotate(Math.sin(Date.now() / 1000.0), vec3(1, 2, 3))
    );

    window.requestAnimationFrame(render);
  };

  render();
}
