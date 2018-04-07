function log(data) {
  $('body').prepend('<pre>' + data + '</pre>');
}

let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class App {

  init() {
    this.android = /android/i.test(navigator.userAgent || navigator.vendor || window.opera);
    this.ws = new WebSocket(webSocketUrl);
    this.ws.onopen = () => window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
    document.getElementById('shoot').addEventListener('click', () => this.handleShoot(), true);
    this.ws.onmessage = (e) => console.log(e.data);
  }

  handleOrientation(event) {
    let x = event.gamma;
    let y = -event.beta;
    if (Math.abs(x) <= 5) x = 0; else this.previousX = x;
    if (Math.abs(y) <= 5) y = 0; else this.previousY = y;
    let obj = { type: 'move', x, y };
    this.ws.send(JSON.stringify(obj));
  }

  handleShoot() {
    let obj = {
      type: 'shot',
      x: this.previousX,
      y: this.previousY
    };
    this.ws.send(JSON.stringify(obj));
  }
}

app = new App();
