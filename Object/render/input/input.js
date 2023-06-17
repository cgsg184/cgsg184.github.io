export class _input {
  canva;
  mx;
  my;

  mdx;
  mdy;
  mdz; /* Wheel rotate */

  mButton;
  keysDown;

  constructor(canva) {
    this.mdx == 0;
    this.mdy == 0;
    this.mdz == 0;
    this.canva = canva;
    canva.addEventListener("wheel", this.mWheel, false);
    canva.addEventListener("mousemove", this.mMove, false);
    window.addEventListener("keydown", this.keyDown, false);
  }

  mWheel = (e) => {
    this.mdz = e.deltaY;
  };
  mMove = (e) => {
    this.mButton = e.buttons;

    this.mdx = e.movementX;
    this.mdy = e.movementY;
    this.mx = e.offsetX;
    this.my = e.offsetY;
  };
  keyDown = (e) => {
    this.keysDown = e.code;
  };

  reset() {
    this.mButton = this.keysDown = undefined;
    this.mdx = this.mdy = this.mdz = 0;
  }
}

export function input(...arg) {
  return new _input(...arg);
}
