function log(data) {
  $('body').prepend('<pre>' + data + '</pre>');
}

let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class App {

  init() {
    this.ws = new WebSocket(webSocketUrl);
    this.ws.onopen = () => {
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);
      window.addEventListener('devicemotion', (e) => this.handleMotion(e), true);
    };
    this.ws.onmessage = (e) => console.log(e.data);
    log('initialized');
  }

  handleOrientation(event) {
    let x = event.gamma;
    let y = -event.beta;
    if (Math.abs(x) <= 5) x = 0;
    if (Math.abs(y) <= 5) y = 0;
    let obj = { type: 'move', x: x, y: y }
    this.ws.send(JSON.stringify(obj));
  }

  handleMotion(event) {
    let x = event.accelerationIncludingGravity.x;
    let y = event.accelerationIncludingGravity.y;
    let z = event.accelerationIncludingGravity.z;
    log(JSON.stringify({ x, y, z }));
  }
}

app = new App();
