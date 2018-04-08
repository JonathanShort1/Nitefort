function newPickup() {
  let i = Math.floor(Math.random() * ps.length);
  return new ps[i]();
}

class Pickup {
  constructor(image) {
    this.getPos();
    this.size = 10;
    this.skin = new Image();
    this.skin.src = "images/" + image;
  }

  newPos() {
    this.x = Math.floor(Math.random() * (game.width - spawnBorder * 2)) + spawnBorder;
    this.y = Math.floor(Math.random() * (game.height - spawnBorder * 2)) + spawnBorder;
  }

  getPos() {
    let posOk = false;
    while (!posOk) {
      this.newPos();
      posOk = true;
      for (let id in model.players) {
        let player = model.players[id];
        if (Math.hypot(player.x - this.x, player.y, this.y) < 40) {
          posOk = false;
          break;
        }
      }

    }
  }

  step() {
    for (let id in model.players) {
      let player = model.players[id];
      if (Math.hypot(player.x - this.x, player.y - this.y) < player.size + this.size) {
        this.action(player);
        this.destroyPickup();
        break;
      }
    }
  }

  action() {

  }

  draw(ctx) {
    ctx.drawImage(this.skin, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
  }

  destroyPickup() {
    let i = model.pickups.indexOf(this);
    if (i !== -1) {
      model.pickups.splice(i, 1)
    }
  }
}

class Speed extends Pickup {
  constructor() {
    super("speed.png");
  }
  action(player) {
    player.speed *=2;
    setTimeout(()=>player.speed/=2, 10*1000)
  }
}

class HealthPickup extends Pickup {
  constructor() {
    super("health.png");
  }

  action(player) {
    player.hp += 1;
  }
}

class Weapon extends Pickup {
  constructor(shot, reload, name) {
    super("bullet.png");
    this.shot = shot;
    this.reload = reload;
    this.name = name;
  }

  action(player) {
    player.weapons.push(this);
  }
}

class Pistol extends Weapon {
  constructor() {
    super(PistolShot, 800, "Pistol");
  }
}

class SMG extends Weapon {
  constructor() {
    super(PistolShot, 0, "SMG");
  }
}

class Sniper extends Weapon {
  constructor() {
    super(SniperShot, 1200, "Sniper");
    this.damage = 3;
  }
}



let ps = [HealthPickup, SMG, Sniper, Speed];