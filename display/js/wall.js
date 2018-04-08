let wallDist = 30;
let wallHp = 5;
let wallLen = 40;

let wallLife = 30 * 1000; // 30 seconds

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

    setTimeout(()=>this.destroyWall(), wallLife);
  }

  static unitVec(x, y) {
    let hypot = Math.hypot(x, y);
    return [x / hypot, y / hypot];
  }

  static vecEq(a, b) {
    return {
      start: a,
      dir: Wall.unitVec(b[0] - a[0], b[1] - a[1]),
      limita: 0,
      limitb: Math.hypot(a[0] - b[0], a[1] - b[1])
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
    let inRange = true;
    inRange &= a_equation.limita <= intersection_lambda;
    inRange &= intersection_lambda <= a_equation.limitb;

    return inRange ? intersection_lambda : null;
  }

  distToPoint(x, y) {
    let thisEq = Wall.vecEq(this.a, this.b);

    let perp = Wall.vecEq(this.a, this.b);
    perp.start = [x, y];
    perp.dir = [-perp.dir[1], perp.dir[0]];
    perp.limita = -Infinity;
    perp.limitb = Infinity;

    let cross = Wall.crossingPos(thisEq, perp);

    return cross===null ? null : Wall.crossingPos(perp, thisEq);
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