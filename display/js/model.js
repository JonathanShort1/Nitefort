let pickupDelay = 10 * 1000; // 1 pickup every approx. 10 seconds


class Model {
  constructor() {
    this.ws = null;
    this.players = {};
    this.shots = [];
    this.walls = [];
    this.pickups = [];
    this.connectWs();

    this.startHp = 5;
    this.maxSize = 25;
    this.minSize = 5;

    this.playerSpeed = 150; // pixels per second

    setInterval(Model.maybeNewPickup, 1000);
  }

  static maybeNewPickup() {
    if (Math.random() < 0.3) {
      model.pickups.push(newPickup());
    }
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
      // console.log(e.data);
      this.onMessage(e)
    };
  }

  onMessage(event) {
    let msg = JSON.parse(event.data);
    let player = undefined;
    if (msg.type !== 'connect' && msg.type !== 'playerConnect' && msg.hasOwnProperty("id")) {

      player = this.players[msg.id];
    }

    switch (msg.type) {
      case 'connect':
        this.id = msg.id;
        break;
      case 'playerConnect':
        player = new Player(msg);
        this.players[player.id] = player;
        break;
      case 'move':
        player.move(msg.x, msg.y);
        break;
      case 'shot':
        console.log("shot");
        let shot = new player.weapon.shot(msg, player);
        this.shots.push(shot);
        break;
      case 'wall':
        this.walls.push(new Wall(msg.x, msg.y, player));
        break;
      case 'switch':
        player.switchWeapon();
        break;
      default:
        console.log("unknown action");
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
    for (let pickup of this.pickups) {
      pickup.step();
    }
  }

  kill(killedId, killerId) {
    this.ws.send(JSON.stringify({type: "death", id: killedId, killedby: killerId}));
    delete this.players[killedId];
  }
}

model = new Model();
