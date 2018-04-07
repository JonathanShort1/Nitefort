function log(data) {
  $('body').prepend('<pre>' + data + '</pre>');
}

let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class App {

  init() {
    this.android = /android/i.test(navigator.userAgent || navigator.vendor || window.opera);
    this.ws = new WebSocket(webSocketUrl);
    this.ws.onopen = () => {
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
      $('#shoot').addEventListener('click', (e) => handleShoot());
    }
    this.ws.onmessage = (e) => console.log(e.data);
  }

  handleOrientation(event) {
    let x = event.gamma;
    let y = event.beta;
    if (Math.abs(x) <= 5) x = 0;
    if (Math.abs(y) <= 5) y = 0;
    let obj = { type: 'move', x, y };
    this.previousX = x;
    this.previousY = y;
    this.ws.send(JSON.stringify(obj));
  }

  handleShoot() {
    let obj = {
      type: 'shoot',
      x: this.previousX,
      y: this.previousY
    };
    this.ws.send(JSON.stringify(obj));
  }
}

app = new App();
