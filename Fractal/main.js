function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) alert(gl.getShaderInfoLog(shader));
  
    return shader;
}

async function createProgram(shaderURL) {
  try {
     const response = await fetch(shaderURL);
     const text = await response.text();
     
     //console.log(text);
     return text.then();     
  } catch(err) {
    console.log(err);
  }
}

export function initGL() {
    const canvas = document.getElementById("glCanvas");
    const canvas1 = document.getElementById("glCanvas1");
    const gl = canvas.getContext("webgl2");
    const gl1 = canvas1.getContext("webgl2");

    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl1.clearColor(1, 0, 0, 1);
    gl1.clear(gl.COLOR_BUFFER_BIT);

    const TimeStart = Date.now();
    const vs = 
    `#version 300 es
    in highp vec4 in_pos;
    out highp vec2 o_pos;

    void main() {
        gl_Position = in_pos;
        o_pos = in_pos.xy;
    }
  `;
  const fs = `#version 300 es
    out highp vec4 o_color;
    in highp vec2 o_pos;
    uniform highp float Time;

     void main() {
        highp float i;
        highp vec2 Z, Z1, Z0, C;
        Z0.x = 0.08 * sin(Time + 3.0) + 0.35;
        Z0.y = 0.08 * sin(1.1 * Time) + 0.39;

        Z = Z1 = o_pos * 2.0;
        for (i = 0.0; i < 1.0 && Z1.x * Z1.x + Z1.y * Z1.y < 4.0; i += 1.0 / 255.0)
          {
            Z1.x = Z.x * Z.x - Z.y * Z.y + Z0.x;
            Z1.y = Z.y * Z.x + Z.x * Z.y + Z0.y;
            Z = Z1; 
          }
        o_color = vec4(i, i * 1.2, i * 3.0, 1.0);
        }
  `;

  const vs1 = 
  `#version 300 es
  in highp vec4 in_pos;
  out highp vec2 o_pos;

  void main() {
      gl_Position = in_pos;
      o_pos = in_pos.xy;
  }
`;
const fs1 = `#version 300 es
  out highp vec4 o_color;
  in highp vec2 o_pos;
  uniform highp float Time;

   void main() {
      highp float i;
      highp vec2 Z, Z1, Z0, C;

      Z = Z1 = Z0 = o_pos * 2.0;
      for (i = 0.0; i < 1.0 && Z1.x * Z1.x + Z1.y * Z1.y < 4.0; i += 1.0 / 255.0)
        {
          Z1.x = Z.x * Z.x - Z.y * Z.y + Z0.x;
          Z1.y = Z.y * Z.x + Z.x * Z.y + Z0.y;
          Z = Z1; 
        }
      o_color = vec4(i, i * 1.2, i * 3.0, 1.0);
      }
`;
  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);
  const vertexSh1 = loadShader(gl1, gl1.VERTEX_SHADER, vs1);
  const fragmentSh1 = loadShader(gl1, gl1.FRAGMENT_SHADER, fs1);
  
  const program = gl.createProgram();
  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);
  const program1 = gl1.createProgram();
  gl1.attachShader(program1, vertexSh1);
  gl1.attachShader(program1, fragmentSh1);
  gl1.linkProgram(program1);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(program));
  }
  if (!gl1.getProgramParameter(program1, gl1.LINK_STATUS)) {
    alert(gl1.getProgramInfoLog(program1));
  }

  const timer = () => {
      gl.useProgram(program);
      gl1.useProgram(program1);
      let TimeFromStart = Date.now() - TimeStart;
 
      const posLoc = gl.getAttribLocation(program, "in_pos");
      const uniformTimeLoc = gl.getUniformLocation(program, "Time");
      const posLoc1 = gl1.getAttribLocation(program1, "in_pos");
      const uniformTimeLoc1 = gl1.getUniformLocation(program1, "Time");
    
      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      const pos = [-1, -1, 0, 1, 3, -1, 0, 1, -1, 3, 1, 1];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
      gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);
      gl.uniform1f(uniformTimeLoc, TimeFromStart / 1000.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const posBuf1 = gl1.createBuffer();
      gl1.bindBuffer(gl1.ARRAY_BUFFER, posBuf1);
      const pos1 = [-1, -1, 0, 1, 3, -1, 0, 1, -1, 3, 1, 1];
      gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(pos), gl1.STATIC_DRAW);
      gl1.vertexAttribPointer(posLoc1, 4, gl1.FLOAT, false, 0, 0);
      gl1.enableVertexAttribArray(posLoc1);
      gl1.uniform1f(uniformTimeLoc1, TimeFromStart / 1000.0);
      gl1.drawArrays(gl1.TRIANGLES, 0, 3);


      window.requestAnimationFrame(timer);
    };

  timer();
  }
