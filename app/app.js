function log(data) {
  $('body').append('<pre>' + data + '</pre>');
}

let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class App {

  init() {
    this.android = /android/i.test(navigator.userAgent || navigator.vendor || window.opera);
    this.ws = new WebSocket(webSocketUrl);
    this.ws.onopen = () => window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
    this.ws.onmessage = (e) => console.log(e.data);

    this.wallMode = false;

    let shoot = $('#shoot');
    shoot.width($('body').width());
    shoot.height(shoot.width());
    shoot.on('touchstart', (e) => this.handleShoot(e));

    let wall = $('#wall');
    wall.width(shoot.width());
    wall.height($('html').height() - shoot.height());
    shoot.on('touchstart', (e) => this.wallMode = true);
    shoot.on('touchend', (e) => this.wallMode = false);
  }

  handleOrientation(event) {
    let x = event.gamma;
    let y = -event.beta;
    if (Math.abs(x) <= 5) x = 0; else this.previousX = x;
    if (Math.abs(y) <= 5) y = 0; else this.previousY = y;
    let obj = { type: 'move', x, y };
    this.ws.send(JSON.stringify(obj));
  }

  handleShoot(event) {
    let shoot = $('#shoot');
    let offset = shoot.offset();
    let touch = event.touches[0];
    let x = touch.pageX - offset.left - (shoot.width() / 2);
    let y = touch.pageY - offset.top - (shoot.height() / 2);
    let type = this.wallMode ? 'wall' : 'shot';
    let obj = { type, x, y };
    this.ws.send(JSON.stringify(obj));
  }
}

app = new App();
