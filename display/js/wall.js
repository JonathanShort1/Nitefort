let wallDist = 30;
let wallHp = 5;
let wallLen = 40;

class Wall {
  constructor(x, y, player) {
    this.hp = wallHp;
    let hypot = Math.hypot(x, y);
    let mid = [
      player.x + x * wallDist / hypot,
      player.y + y * wallDist / hypot
    ];
    this.a = [
      mid[0] - y * wallLen / hypot,
      mid[1] + x * wallLen / hypot
    ];
    this.b = [
      mid[0] + y * wallLen / hypot,
      mid[1] - x * wallLen / hypot
    ];
  }

  static unitVec(x, y) {
    let hypot = Math.hypot(x, y);
    return [x / hypot, y / hypot];
  }

  static vecEq(a, b) {
    return {
      start: a,
      dir: Wall.unitVec(b[0] - a[0], b[1] - a[1]),
      limit: Math.hypot(a[0] - b[0], a[1] - b[1])
    }
  }

  static crossingPos(a_equation, b_equation) {
    let [a, b] = [b_equation.start[0], b_equation.dir[0]];
    let [c, d] = [a_equation.start[0], a_equation.dir[0]];
    let [e, f] = [b_equation.start[1], b_equation.dir[1]];
    let [g, h] = [a_equation.start[1], a_equation.dir[1]];
    let intersection_lambda = e * b + f * c - a * f - g * b;
    let divisor = h * b - d * f;
    if (divisor === 0)
      return null;
    intersection_lambda /= divisor;
    let lim = a_equation.limit;
    let inRange = true;
    inRange &= 0 <= intersection_lambda;
    inRange &= intersection_lambda <= lim;

    return inRange ? intersection_lambda : null;
  }

  damage() {
    this.hp -= 1;
    if (this.hp === 0) {
      this.destroyWall();
    }
  }

  destroyWall() {
    let i = model.walls.indexOf(this);
    if (i !== -1) {
      model.walls.splice(i, 1)
    }
  }
}