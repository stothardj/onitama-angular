export class Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;

  width: number;
  height: number;

  centerX: number;
  centerY: number;

  constructor(left: number, top: number, right: number, bottom: number) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;

    this.width = right - left;
    this.height = bottom - top;

    this.centerX = (left + right) / 2;
    this.centerY = (top + bottom) / 2;
  }

  contains(x: number, y: number) {
    return x >= this.left
      && x <= this.right
      && y >= this.top
      && y <= this.bottom;
  }
}
