class Game {
  constructor() {
    this.bg = "black";
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.prevMillis=null;
  }

  init() {
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

    for (let shot of model.shots) {
      this.drawShot(shot);
    }

    for (let id in model.players) {
      this.drawPlayer(model.players[id]);
    }
    for (let wall of model.walls) {
      this.drawWall(wall);
    }
  }

  drawPlayer(player){
    let ctx = this.ctx;
    /*ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, 2*Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();*/
    ctx.drawImage(player.skin, player.x, player.y, player.size, player.size);
  }

  drawShot(shot) {
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, model.shotSize, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  drawWall(wall){
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(wall.a[0],wall.a[1]);
    ctx.lineTo(wall.b[0],wall.b[1]);
    ctx.strokeStyle="white";
    ctx.lineWidth=4;
    ctx.stroke();
  }
}

game = new Game();
