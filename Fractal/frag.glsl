/**/
#version 300 es
    out highp vec4 o_color;
    in highp vec2 color;

     void main() {
         highp float i;
         highp vec2 Z, Z1, Z0;
         //C.x = 0.0, C.y = 0.0;
         //Z = Z1 = Z0 = C;
         Z = Z1 = Z0 = color * 2.0;
         for (i = 0.0; i < 1.0 && Z1.x * Z1.x + Z1.y * Z1.y < 4.0; i += 1.0 / 255.0)
            {
             Z1.x = Z.x * Z.x - Z.y * Z.y + Z0.x;
             Z1.y = Z.y * Z.x + Z.x * Z.y + Z0.y;
             Z = Z1; 
         }
         o_color = vec4(1, i, 1, 1);
      }