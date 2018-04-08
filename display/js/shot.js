class Shot {
  constructor(msg, player, size, speed) {
    this.x = player.x;
    this.y = player.y;

    this.shooterId = player.id;

    this.dx = msg.x;
    this.dy = msg.y;

    let hypot = Math.hypot(this.dx, this.dy);

    if (hypot !== 0) {
      this.dx *= speed / hypot;
      this.dy *= speed / hypot;

      this.x += this.dx / speed * player.size;
      this.y += this.dy / speed * player.size;
    }

    this.size = 3;
    this.damage = 1;
  }

  step(dt) {
    let prev = [this.x, this.y];

    this.x += this.dx * dt;
    this.y += this.dy * dt;

    this.bounds();
    this.hitPlayers();

    let thisEq = Wall.vecEq(prev, [this.x, this.y]);
    for (let wall of model.walls) {
      let wallEq = Wall.vecEq(wall.a, wall.b);
      if (Wall.crossingPos(wallEq, thisEq) !== null && Wall.crossingPos(thisEq, wallEq)) {
        wall.damage();
        this.destroyShot();
        break;
      }
    }
  }

  hitPlayers() {
    for (let id in model.players) {
      let player = model.players[id];
      if (player.id === this.shooterId) {
        continue;
      }

      if (Math.hypot(player.x - this.x, player.y - this.y) < this.size + player.size) {
        player.damage(this);

        this.destroyShot();
        break;
      }
    }
  }

  destroyShot() {
    let i = model.shots.indexOf(this);
    if (i !== -1) {
      model.shots.splice(i, 1)
    }
  }

  bounds() {
    if ((this.x < -this.size)
      || (this.y < -this.size)
      || (this.x > game.width + this.size)
      || (this.y > game.height + this.size)) {
      this.destroyShot()
    }
  }
}

class PistolShot extends Shot {
  constructor(msg, player) {
    super(msg, player, 3, 300);
  }
}

class SniperShot extends Shot {
  constructor(msg, player) {
    super(msg, player, 4, 1000);
  }
}