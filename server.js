let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let expressWs = require('express-ws')(app);
let fs = require('fs');
let https = require('https');

let clients = [];
let clientId = 0;
let game = null;

let router = express.Router();

app.use('/', router);
app.use('/nitefort/', router);

router.use('/display', express.static('display'));
router.use(bodyParser.json());

// ==================================================
// THE WEBSOCKET COMMUNICATION
// ==================================================

router.ws('/user', function (ws, req) {
  console.log('Client connection made!' + clientId);
  ws.clientId = clientId;
  clients.push(ws);
  clientId += 1;

  ws.on("message", function (msg) {
    console.log('Message received');
    console.log(msg);
    handleClient(ws, JSON.parse(msg));
  });

  ws.on('close', function () {
    console.log('client leaving');
    let index = clients.indexOf(ws);
    clients.splice(index, 1);
  });
});

router.ws('/display', function (ws, req) {
  if (game == null) {
    console.log('display connected!');
    game = ws;
  } else {
    console.log('error: game still in progress');
  }

  ws.on('message', function (msg) {
    console.log('Message received');
    console.log(JSON.stringify(msg));
    handleDisplay(ws, msg);
  });

  ws.on('close', function () {
    console.log('display disconnected');
    game = null;
  })
});


/**
 * Log any server-side errors to the console and send 500 error code.
 */
router.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});
app.listen(21067);
console.log('Server running, access game by going to http://138.251.206.220:21067/Nitefort/game.html');


// ==================================================
// IMPLEMENT THE API AND WEBSOCKET COMMUNICATION HERE
// ==================================================


function handleClient(ws, msg) {
  switch (msg.type) {
    case 'move':
      game.send(JSON.stringify({
        type: 'move',
        id: ws.clientId,
        x: msg.x,
        y: msg.y
      }));
      break;
    default:
      console.log('unknown type');
  }
}

function handleDisplay(ws, msg) {

}
