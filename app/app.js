function log(data) {
  $('body').append(`<pre>${data}</pre>`);
}

class App {

  init(ws) {
    this.ws = ws;
    window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));

    this.ws.onmessage = (e) => this.handleMessage(e);

    this.wallMode = false;
    this.godMode = false;

    this.wallReloadSpeed = 1000; // 1 second
    this.weaponReloadSpeed = 1000;

    let shoot = $('#shoot');
    shoot.width($('body').width());
    shoot.height(shoot.width());
    shoot.on('touchstart', (e) => this.handleShoot(e));

    let weapon = $('#weapon');
    weapon.width(shoot.width() / 2);
    weapon.height($('html').height() - shoot.height());
    weapon.on('touchstart', (e) => this.handleWeapon(e));

    let wall = $('#wall');
    wall.width(shoot.width() / 2);
    wall.height($('html').height() - shoot.height());
    wall.on('touchstart', (e) => {
      this.wallMode ^= 1;
      if (this.wallMode) {
        wall.addClass('wall-mode');
        shoot.addClass('wall-mode');
      } else {
        wall.removeClass('wall-mode');
        shoot.removeClass('wall-mode');
      };
    });
  }

  handleOrientation(event) {
    let x = Math.round(event.gamma);
    let y = Math.round(-event.beta);
    if (Math.abs(x) <= 5) x = 0;
    if (Math.abs(y) <= 5) y = 0;

    if (x !== this.previousX || y !== this.previousY) {
      let obj = { type: 'move', x, y };

      this.ws.send(JSON.stringify(obj));
      this.previousX = x;
      this.previousY = y;
    }

    if (this.godMode) {
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          this.ws.send(JSON.stringify({
            type: 'shot',
            x: i,
            y: j
          }));
        }
      }
    }
  }

  handleShoot(event) {
    let shoot = $('#shoot');
    if (shoot.hasClass('enabled')) {
      let offset = shoot.offset();
      let touch = event.touches[0];
      let x = touch.pageX - offset.left - (shoot.width() / 2);
      let y = touch.pageY - offset.top - (shoot.height() / 2);
      let type = this.wallMode ? 'wall' : 'shot';
      let obj = { type, x, y };
      this.ws.send(JSON.stringify(obj));
      shoot.removeClass('enabled');
      setTimeout(() => shoot.addClass('enabled'), this.wallMode ? this.wallReloadSpeed : this.weaponReloadSpeed);
    }
  }

  handleWeapon(event) {
    this.ws.send(JSON.stringify({ type: 'switch' }));
  }

  handleMessage(event) {
    let obj = JSON.parse(event.data);
    switch (obj.type) {
      case 'weapon':
        this.weaponReloadSpeed = obj.reload;
        $('#weapon').text(obj.name);
        break;
    }
  }
}
