function log(data) {
  $('body').prepend('<pre>' + data + '</pre>');
}

let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class App {

  init() {
    this.android = /android/i.test(navigator.userAgent || navigator.vendor || window.opera);
    alert(this.android ? 'android' : 'not android');
    this.ws = new WebSocket(webSocketUrl);
    this.ws.onopen = () => {
      window.addEventListener('devicemotion', (e) => this.handleMotion(e));
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
    }
    this.ws.onmessage = (e) => console.log(e.data);
    log('initialized');
  }

  handleOrientation(event) {
    let x = event.gamma;
    let y = event.beta;
    if (Math.abs(x) <= 5) x = 0;
    if (Math.abs(y) <= 5) y = 0;
    let obj = { type: 'move', x, y };
    this.ws.send(JSON.stringify(obj));
  }

  handleMotion(event) {
    let x = event.accelerationIncludingGravity.x;
    let y = event.accelerationIncludingGravity.y;
    x = android ? x : -x;
    y = android ? -y : y;
    if (Math.hypot(x, y) >= 10) {
      if (this.prevShot !== undefined
        && (new Date().getTime()) - this.prevShot > 500) {
        let obj = { type: 'shot', x, y };
        this.ws.send(JSON.stringify(obj));
        log(JSON.stringify(obj));
      }
      this.prevShot = new Date().getTime();
    }
  }
}

app = new App();
