function log(data) {
  $('body').append('<pre>' + data + '</pre>');
}

let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class App {

  init() {
    window.addEventListener('devicemotion', this.handleMotion);
    /*
    this.ws = new WebSocket(webSocketUrl);
    this.ws.onopen = () => {
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);
      window.addEventListener('devicemotion', (e) => this.handleMotion(e), true);
    };
    this.ws.onmessage = (e) => console.log(e.data);
    log('initialized');*/
  }

  handleOrientation(event) {
    var x = event.gamma;
    var y = -event.beta;
    if (Math.abs(x) <= 5) x = 0;
    if (Math.abs(y) <= 5) y = 0;
    var obj = { type: 'move', x: x, y: y }
    this.ws.send(JSON.stringify(obj));
  }

  handleMotion(event) {
    var x = event.acceleration.x;
    var y = event.acceleration.y;
    log(JSON.stringify({ x, y }));
  }
}

app = new App();
