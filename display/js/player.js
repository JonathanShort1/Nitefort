let colors = ["red", "green", "blue", "yellow", "orange"];
let skins = ["batman.png", "america.png", "hulk.png", "spiderman.png", "superman.png"];
let spawnBorder = 50;

class Player {
  constructor(msg) {
    this.id = msg.id;
    this.color = colors[this.id % colors.length];
    this.skin = new Image();
    this.skin.src = "images/" + skins[this.id % skins.length];
    this.x = Math.floor(Math.random() * (game.width - spawnBorder * 2)) + spawnBorder;
    this.y = Math.floor(Math.random() * (game.height - spawnBorder * 2)) + spawnBorder;
    this.dx = 0;
    this.dy = 0;
    this.hp = model.startHp;
  }

  step(dt) {
    let [px, py] = [this.x, this.y];

    this.x += this.dx * dt;
    this.y += this.dy * dt;

    if (this.x < this.size) {
      this.x = this.size;
    }
    if (this.y < this.size) {
      this.y = this.size;
    }
    if (this.x > game.width - this.size) {
      this.x = game.width - this.size;
    }
    if (this.y > game.height - this.size) {
      this.y = game.height - this.size;
    }

    for (let wall of model.walls) {
      let thisEq = Wall.vecEq([px, py], this.x, this.y);
      let wallEq = Wall.vecEq(wall.a, wall.b);
      let thisCross = Wall.crossingPos(thisEq, wallEq);
      if (thisCross !== null && Wall.crossingPos(wallEq, thisEq) !== null) {
        let wallLineDist =
          Math.abs(thisEq.dir[0] * wallEq.dir[1] - thisEq.dir[1] * wallEq.dir[0])
          / Math.hypot(thisEq.dir[0], thisEq.dir[1])
          / Math.hypot(wallEq.dir[0], wallEq.dir[1]);
        thisCross -= Math.sign(thisCross) * wallLineDist;
        this.x = thisEq.start[0] + thisEq.dir[0] *thisCross;
        this.y = thisEq.start[1] + thisEq.dir[1] *thisCross;
      }
    }
  }

  get size() {
    return model.minSize + (model.maxSize - model.minSize) * this.hp / model.startHp;
  }

  move(x, y) {
    this.dx = x;
    this.dy = y;
    let hypot = Math.hypot(this.dx, this.dy);
    if (hypot !== 0) {
      this.dx *= model.playerSpeed / hypot;
      this.dy *= model.playerSpeed / hypot;
    }
  }

  damage(killerId) {
    this.hp--;
    if (this.hp <= 0) {
      model.kill(this.id, killerId);
    }
  }
}
