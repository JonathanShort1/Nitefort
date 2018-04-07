class Model {
  constructor() {
    this.ws = null;
    this.players = {};
    this.shots = [];
    this.connectWs();

    this.playerSize = 7;
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
  }

  step(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;
  }

  move(x, y) {
    this.dx = x;
    this.dy = y;
    let hypot = Math.hypot(this.dx, this.dy);
    if (hypot !== 0) {
      this.dx *= model.playerSpeed / hypot;
      this.dy *= model.playerSpeed / hypot;
    }
    if (this.x < model.playerSize) {
      this.x = model.playerSize;
    }
    if (this.y < model.playerSize) {
      this.y = model.playerSize;
    }
    if (this.x > game.width - model.playerSize) {
      this.x = game.width - model.playerSize;
    }
    if (this.y > game.height - model.playerSize) {
      this.y = game.height - model.playerSize;
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
    }
  }

  step(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;
  }
}

model = new Model();
