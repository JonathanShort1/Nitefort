class Model {
  constructor() {
    this.ws = null;
    this.players = {};
    this.shots = [];
    this.walls = [];
    this.connectWs();

    this.startHp = 5;
    this.maxSize = 25;
    this.minSize = 5;

    this.shotSize = 3;
    this.playerSpeed = 150; // pixels per second
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
      case 'wall':
        player = this.players[msg.id];
        this.walls.push(new Wall(msg.x, msg.y, player));
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

  kill(killedId, killerId) {
    this.ws.send(JSON.stringify({type: "death", id: killedId, killedby: killerId}));
    delete this.players[killedId];
  }
}

model = new Model();
