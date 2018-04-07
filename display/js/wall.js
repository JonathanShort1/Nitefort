let wallDist = 30;
let wallHp = 5;
let wallLen = 40;

class Wall {
  constructor(x, y, player) {
    this.hp = wallHp;
    let hypot = Math.hypot(x,y);
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


}