let colors = ["red", "green", "blue", "yellow", "orange"];
let skins = ["batman.jpeg", "america.png", "hulk.jpeg", "spiderman.jpg", "superman.jpg"];
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
