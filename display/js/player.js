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
    this.weapons = [new Pistol()];
    this.weaponInd = 0;
    this.switchWeapon();
    this.speed = model.playerSpeed;
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
      let dist = wall.distToPoint(this.x, this.y);
      if (dist !== null && Math.abs(dist) < this.size) {
        let perp = Wall.vecEq(wall.a, wall.b);
        perp.start = [this.x, this.y];
        perp.dir = [-perp.dir[1], perp.dir[0]];

        this.x += perp.dir[0] * (Math.abs(dist) - this.size) * Math.sign(dist);
        this.y += perp.dir[1] * (Math.abs(dist) - this.size) * Math.sign(dist);
      } else {
        this.collide(wall.a);
        this.collide(wall.b);
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
      this.dx *= this.speed / hypot;
      this.dy *= this.speed / hypot;
    }
  }

  damage(shot) {
    this.hp-=shot.damage;
    if (this.hp <= 0) {
      model.kill(this.id, shot.shooterId);
    }
  }

  collide(p) {
    let [x, y] = p;
    let hypot = Math.hypot(x - this.x, y - this.y);

    if (hypot < this.size) {
      if (hypot === 0) {
        this.x += 1;
        hypot = 1;
      }
      this.x = x + (this.x - x) / hypot * this.size;
      this.y = y + (this.y - y) / hypot * this.size;
    }
  }

  get weapon() {
    return this.weapons[this.weaponInd];
  }

  switchWeapon() {
    console.log("switch");
    this.weaponInd = (this.weaponInd + 1) % this.weapons.length;
    model.ws.send(JSON.stringify({'type': 'weapon', name: this.weapon.name, reload: this.weapon.reload, id: this.id}));
  }
}
