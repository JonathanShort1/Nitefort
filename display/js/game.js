class Game {
  constructor() {
    this.bg = "black";
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.prevMillis=null;
  }

  init() {
    controller.init();
    let canvas = $("#canvas")[0];
    let canvas_wrapper = $("#canvas-wrapper")[0];
    this.width = this.height = $(window).height();

    canvas.height = this.height;
    canvas.width = this.width;

    $(canvas).css("margin-left", ($(window).width() - this.width) / 2 + "px");

    this.ctx = canvas.getContext("2d");

    this.clear();
  }

  startGame(){
    this.prevMillis = new Date().getTime();
    setInterval(() => {
      this.step();
    }, 20);
  }

  step(){
    let millis = new Date().getTime();
    let dt = millis - this.prevMillis;
    this.prevMillis = millis;

    model.step(dt/1000);
    this.draw();
  }

  clear() {
    let ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = this.bg;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.stroke();
  }

  draw() {
    this.clear();
    for (let id in model.players) {
      this.drawPlayer(model.players[id]);
    }
    for (let shot of model.shots) {
      this.drawShot(shot);
    }
  }

  drawPlayer(player){
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(player.x, player.y, model.playerSize, 0, 2*Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
  }
  drawShot(shot) {
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, model.shotSize, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

game = new Game();