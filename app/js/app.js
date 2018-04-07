function log(data) {
  $('body').prepend('<p>' + data + '</p>');
}

let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class App {

  init() {
    this.ws = new WebSocket(webSocketUrl);
    console.log(this.ws);
    window.addEventListener('deviceorientation', this.handleOrientation, true);
    log('initialized');
  }

  handleOrientation(event) {
    var x = event.gamma;
    var y = event.beta;
    var obj = { type: 'move', x, y }
    this.ws.send(JSON.stringify(obj));
  }
}

app = new App();
