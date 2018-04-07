class Model {
  constructor() {
    this.ws = null;
    this.players = {};
    this.shots = [];
    this.connectWs();

    this.startHp = 5;
    this.maxSize = 25;
    this.minSize = 5;

    this.shotSize = 3;
    this.playerSpeed = 130; // pixels per second
    this.shotSpeed = 300;
  }

  connectWs() {
    if (window.location.protocol === "https:") {
      let splitUrl = location.href.split('/');
      splitUrl = splitUrl.splice(1, splitUrl.length - 2);
      this.ws = new WebSocket(`wss://${splitUrl.join('/')}`);
    } else {
      this.ws = new WebSocket(`ws://${location.host}/display`);
    }
    this.ws.onopen = () => {
      game.startGame();
      console.log("connected");
    };
    this.ws.onclose = this.connectWs;

    this.ws.onmessage = (e) => {
      console.log(e.data);
      this.onMessage(e)
    };
  }

  onMessage(event) {
    let msg = JSON.parse(event.data);
    let player;
    switch (msg.type) {
      case 'connect':
        this.id = msg.id;
        break;
      case 'playerConnect':
        player = new Player(msg);
        this.players[player.id] = player;
        break;
      case 'move':
        player = this.players[msg.id];
        player.move(msg.x, msg.y);
        break;
      case 'shot':
        player = this.players[msg.id];
        let shot = new Shot(msg, player);
        this.shots.push(shot);
        break;
    }
  }

  step(dt) {
    for (let id in this.players) {
      let player = this.players[id];
      player.step(dt);
    }
    for (let shot of this.shots) {
      shot.step(dt);
    }
  }

  kill(killedId, killerId){
    this.ws.send(JSON.stringify({type:"death", id:killedId, killedby: killerId}));
    delete this.players[killedId];
  }
}

let colors = ["red", "green", "blue", "yellow", "orange"];
let spawnBorder = 50;


class Player {
  constructor(msg) {
    this.id = msg.id;
    this.color = colors[this.id % colors.length];
    this.x = Math.floor(Math.random() * (game.width - spawnBorder * 2)) + spawnBorder;
    this.y = Math.floor(Math.random() * (game.height - spawnBorder * 2)) + spawnBorder;
    this.dx = 0;
    this.dy = 0;
    this.hp = model.startHp;
  }

  step(dt) {
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

  damage(killerId){
    this.hp--;
    if (this.hp <= 0){
      model.kill(this.id, killerId);
    }
  }
}

class Shot {
  constructor(msg, player) {
    this.x = player.x;
    this.y = player.y;

    this.shooterId = player.id;

    this.dx = msg.x;
    this.dy = msg.y;

    let hypot = Math.hypot(this.dx, this.dy);

    if (hypot !== 0) {
      this.dx *= model.shotSpeed / hypot;
      this.dy *= model.shotSpeed / hypot;

      this.x += this.dx/model.shotSpeed*player.size;
      this.y += this.dy/model.shotSpeed*player.size;
    }
  }

  step(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;

    if (this.outOfBounds()) {
      let i = model.shots.indexOf(this);
      if (i !== -1) {
        model.shots.splice(i, 1)
      }
    }

    for (let id in model.players){
      let player = model.players[id];
      if (player.id === this.shooterId){
        continue;
      }

      if (Math.hypot(player.x-this.x, player.y-this.y) < model.shotSize + player.size){
        player.damage(this.shooterId);

        let i = model.shots.indexOf(this);
        if (i !== -1) {
          model.shots.splice(i, 1)
        }
      }
    }
  }

  outOfBounds() {
    return (this.x < -model.shotSize)
      || (this.y < -model.shotSize)
      || (this.x > game.width + model.shotSize)
      || (this.y > game.height + model.shotSize);
  }
}

model = new Model();
