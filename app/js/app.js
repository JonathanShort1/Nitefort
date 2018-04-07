function log(data) {
  $('body').prepend('<p>' + data + '</p>');
}

let webSocketUrl = 'ws://138.251.206.220:21067/Nitefort';

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
    var obj = {
      type: 'move',
      fields: { x, y }
    }
    this.ws.send(JSON.stringify(obj));
  }
}

app = new App();
