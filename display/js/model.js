let playerSpeed = 100; // pixels per second
let playerSize = 7;   // px

class Model {
  constructor() {
    this.ws = null;
    this._players = {};
    this.connectWs();
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

    this.ws.onmessage = (e)=>{this.onMessage(e)};
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
        player.dx = msg.x;
        player.dy = msg.y;
        let hypot = Math.hypot(player.dx, player.dy);
        player.dx *= playerSpeed / hypot;
        player.dy *= playerSpeed / hypot;
        break;
    }
  }

  get players() {
    return this._players;
  }

  step(dt) {
    for (let id in this.players) {
      let player = this.players[id];
      player.x += player.dx * dt;
      player.y += player.dy * dt;
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
}

model = new Model();
