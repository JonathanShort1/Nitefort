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
router.use('/user', express.static('app'));
router.use(bodyParser.json());

// ==================================================
// THE WEBSOCKET COMMUNICATION
// ==================================================

router.ws('/user', function (ws, req) {
  console.log('Client connection made! ' + clientId);
  ws.clientId = clientId;
  clients.push(ws);
  if (game != null) {
    game.send(JSON.stringify({"type" : "playerConnect", "id" : clientId}));
  } else {
    ws.send(JSON.stringify({"type" : "error", "message" : "No game available"}));
  }
  clientId += 1;

  ws.on("message", function (msg) {
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
    handleDisplay(ws, msg);
  });

  ws.on('close', function () {
    console.log('display disconnected');
    game = null;
  })
});

app.post("/voice", function(req, res) {
  voiceHandler();
});


/**
 * Log any server-side errors to the console and send 500 error code.
 */
router.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});
app.listen(21067);
console.log('Server running, access game by going to https://js321.host.cs.st-andrews.ac.uk/nitefort/display/game.html');


// ==================================================
// IMPLEMENT THE API AND WEBSOCKET COMMUNICATION HERE
// ==================================================


function handleClient(ws, msg) {
  if (game != null) {
    switch (msg.type) {
      case 'move':
        game.send(JSON.stringify({
          type: 'move',
          id: ws.clientId,
          x: msg.x,
          y: msg.y
        }));
        break;
      case 'shot':
        game.send(JSON.stringify({
          type: 'shot',
          id: ws.clientId,
          x: msg.x,
          y: msg.y
        }));
        break;
      case 'wall':
        game.send(JSON.stringify({
          type: 'wall',
          id: ws.clientId,
          x: msg.x,
          y: msg.y
        }));
        break;
      default:
        console.log('unknown type: ' + msg.type);
    }
  } else {
    ws.send(JSON.stringify({"type" : "error", "message" : "No game available"}));
  }
}

function handleDisplay(ws, msg) {
  let clientWS = clients.find(c => c.clientId == msg.id);
  if (clientWS != null) {
    switch (msg.type) {
      case 'death':
        clientWS.send(JSON.stringify({
          type: 'death',
          killedby: msg.killedby,
        }));
        break;
      case 'nameAssignment':
        clientWS.send(JSON.stringify( {
          type: "nameAssignment",
          id: msg.id,
          name: msg.nameIndex
        }));
      default:
        console.log('unknown type');
    }
  } else {
    console.log(msg);
    ws.send(JSON.stringify({
      "type" : "error",
       "message" : "Client Id not present"
     }));
  }
}
