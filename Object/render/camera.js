import { mat4, _mat4, vec3, _vec3, _input, _timer } from "../all_h.js";

/* Camera module */
export class _camera {
  projSize;
  projDist;
  projFarClip;

  /** @type {_mat4} */
  matrVP;
  /** @type {_mat4} */
  matrView;
  /** @type {_mat4} */
  matrProj;

  /** @type {_vec3} */
  loc;
  /** @type {_vec3} */
  at;
  /** @type {_vec3} */
  dir;
  /** @type {_vec3} */
  up;
  /** @type {_vec3} */
  right;

  frameW;
  frameH;

  constructor(gl) {
    this.frameW = gl.drawingBufferWidth;
    this.frameH = gl.drawingBufferHeight;

    this.matrVP = mat4();
    this.matrView = mat4();
    this.matrProj = mat4();
    this.loc = vec3();
    this.at = vec3();
    this.dir = vec3();
    this.up = vec3();
    this.right = vec3();

    this.setProj(0.5, 0.5, 100);
    this.set(vec3(0, 3, 3), vec3(0), vec3(0, 1, 0));
  }
  set(
    /** @type {_vec3} */ Loc,
    /** @type {_vec3} */ At,
    /** @type {_vec3} */ Up
  ) {
    this.matrView.view(Loc, At, Up);
    this.matrVP.matrMulmatr(this.matrView, this.matrProj);

    this.loc = Loc;
    this.at = At;
    this.up = Up;

    this.dir.set(
      -this.matrView.m[0][2],
      -this.matrView.m[1][2],
      -this.matrView.m[2][2]
    );
    this.up.set(
      -this.matrView.m[0][1],
      -this.matrView.m[1][1],
      -this.matrView.m[2][1]
    );
    this.right.set(
      -this.matrView.m[0][0],
      -this.matrView.m[1][0],
      -this.matrView.m[2][0]
    );
  }
  setProj(ProjSize, ProjDist, ProjFarClip) {
    let rx, ry;

    rx = ry = ProjSize;

    this.projDist = ProjDist;
    this.projSize = ProjSize;
    this.projFarClip = ProjFarClip;

    /* Correct aspect ratio */
    if (this.frameW > this.frameH) rx *= this.frameW / this.frameH;
    else ry *= this.frameH / this.frameW;

    /* pre-calculate view matrix */
    this.matrProj.frustum(
      -rx / 2,
      rx / 2,
      -ry / 2,
      ry / 2,
      ProjDist,
      ProjFarClip
    );
    this.matrVP.matrMulmatr(this.matrView, this.matrProj);
  }
  setSize(FrameW, FrameH) {
    this.frameW = FrameW;
    this.frameH = FrameH;

    this.setProj(this.projSize, this.projDist, this.projFarClip);
  }
  update(/** @type {_input} */ input, /** @type {_timer} */ timer) {
    if (
      input.keysDown == undefined &&
      input.mdx == 0 &&
      input.mdy == 0 &&
      input.mdz == 0
    )
      return;
    let speed = 10,
      time = timer.globalDeltaTime,
      Dist = vec3(this.at).sub(this.loc).len(),
      CosT = (this.loc.y - this.at.y) / Dist,
      SinT = Math.sqrt(1 - CosT * CosT),
      plen = Dist * SinT,
      CosP = (this.loc.z - this.at.z) / plen,
      SinP = (this.loc.x - this.at.x) / plen,
      Azimuth = (180 / Math.PI) * Math.atan2(SinP, CosP),
      Elevator = (180 / Math.PI) * Math.atan2(SinT, CosT),
      Wp = this.projSize,
      Hp = this.projSize,
      koef1 = ((Dist - 1) * (Dist - 1)) / (18 * Dist),
      koef2 = 1 /*sqrt((Dist - 1) * (Dist - 1) * (Dist - 1)) / (18 * Dist)*/,
      sx = 0,
      sy = 0,
      dv = vec3();

    Azimuth +=
      time *
      koef2 *
      -speed *
      ((((input.mButton == 2) * 500 * input.mdx) / (1 + this.frameW)) * 2 +
        ((input.keysDown == "ArrowLeft") - (input.keysDown == "ArrowRight"))) *
      (15 + 45 * (input.keysDown == "ShiftLeft"));
    Elevator +=
      time *
        koef2 *
        -speed *
        (((input.mButton == 2) * 500 * input.mdy) / (1 + this.frameH)) *
        2 +
      ((input.keysDown == "ArrowUp") - (input.keysDown == "ArrowDown")) *
        (15 + 45 * (input.keysDown == "ShiftLeft"));

    Elevator = Math.min(179.9, Elevator);
    Elevator = Math.max(0.1, Elevator);

    Dist +=
      time *
      koef1 *
      (-input.mdz * (1 + 25 * (input.keysDown == "ShiftLeft")) +
        (8 + 25 * (input.keysDown == "keysDown")) *
          ((input.keysDown == "ArrowUp") - (input.keysDown == "ArrowDown")));

    Dist = Math.max(Dist, 1.1);
    Dist = Math.min(Dist, 10 * this.projFarClip);

    if (this.frameW > this.frameH) Wp *= this.frameW / this.frameH;
    else Hp *= this.frameH / this.frameW;

    sx =
      ((((input.mButton == 1) * -input.mdx * Wp) / this.frameW) * Dist) /
      this.projDist;
    sy =
      ((((input.mButton == 1) * input.mdy * Hp) / this.frameH) * Dist) /
      this.projDist;

    dv = vec3(this.right).mul(sx).add(vec3(this.up).mul(sy));
    this.at.add(dv);
    this.loc.add(dv);

    if (input.keysClick == "KeyF") {
      this.camSet(vec3(20), vec3(0), vec3(0, 1, 0));
      return;
    }

    /*
    if (input.keysDown[VK_LCONTROL] && input.keysClick[VK_RCONTROL]) {
      this.CamSet(this.Loc, vec3(0), vec3(0, 1, 0));
      return;
    }
    */
    if (input.keysClick == "KeyP") timer.isPause = !timer.isPause;

    /*
  if (input.keysDown[VK_SHIFT] && input.keysClick['D'] && !input.keysDown[VK_CONTROL] && !input.keysDown[VK_PRIOR])
    Ttp->PipelineDebugMode = !Ttp->PipelineDebugMode;
  */

    this.set(
      mat4()
        .matrMulmatr(
          mat4().rotateX(Elevator),
          mat4().rotateX(Azimuth),
          mat4().translate(this.at)
        )
        .pointTransform(vec3(0, Dist, 0)),
      this.at,
      vec3(0, 1, 0)
    );
  }
}

export function camera(...arg) {
  return new _camera(...arg);
}
