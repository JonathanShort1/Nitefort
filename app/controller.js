let webSocketUrl = 'wss://js321.host.cs.st-andrews.ac.uk/nitefort/user';

class Controller {

  init(app) {
    this.app = app;
    $('#app').hide();
    $('#play').hide();

    let status = $('#status');
    status.width($('body').width());
    status.height(status.width());

    let play = $('#play');
    play.width($('body').width());
    play.height($('body').height() - status.height());

    this.ws = new WebSocket(webSocketUrl);
    this.ws.onopen = () => {
    };
    this.ws.onmessage = (e) => {
      let obj = JSON.parse(e.data);
      if (obj.type == 'nameAssignment') {
        let name = obj.name;
        let image = '../display/images/' + name + '.png';
        status.html('<img src="' + image + '" with="100%" height="100%"></img>');
        play.show();
      }
    }

    play.click(() => {
      $('#landing').hide();
      $('#app').show();
      this.app.init(this.ws);
    });
  }
}