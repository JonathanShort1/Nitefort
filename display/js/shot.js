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