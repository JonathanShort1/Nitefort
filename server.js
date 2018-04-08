let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let expressWs = require('express-ws')(app);
let fs = require('fs');
let https = require('https');

let numClients = 0;
let maxNumClients = 5;
let ids = Array.from(Array(maxNumClients), (_, x) => false);
let clients = [];
let names = ["batman", "america", "hulk", "spiderman", "superman"];
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
  console.log('Client connection made!');

  if (game !== null) {
    if (numClients < maxNumClients) {
      let id = ids.findIndex((a) => !a);
      ids[id] = true;
      console.log(id);
      ws.clientId = id;
      clients.push(ws);
      game.send(JSON.stringify({ "type": "playerConnect", "id": id }));
      ws.send(JSON.stringify({ type: "nameAssignment", id: id, name: names[id] }));
      numClients += 1;
    } else {
      ws.send(JSON.stringify({ "type": "error", "message": "Server full" }));
    }
  } else {
    ws.send(JSON.stringify({ "type": "error", "message": "No game available" }));
  }

  ws.on("message", function (msg) {
    handleClient(ws, JSON.parse(msg));
  });

  ws.on('close', function () {
    console.log('client leaving');
    ids[ws.clientId] = false;
    let index = clients.indexOf(ws);
    clients.splice(index, 1);
    numClients -= 1;
  });
});

router.ws('/display', function (ws, req) {
  if (game === null) {
    console.log('display connected!');
    game = ws;
  } else {
    console.log('error: game still in progress');
  }

  ws.on('message', function (msg) {
    console.log('Message received');
    handleDisplay(ws, JSON.parse(msg));
  });

  ws.on('close', function () {
    console.log('display disconnected');
    game = null;
  })
});

app.post("/voice", function (req, res) {
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
  if (game !== null) {
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
      case 'switch':
        game.send(JSON.stringify({
          type: 'switch',
          id: ws.clientId
        }));
        break;
      default:
        console.log('unknown type: ' + msg.type);
    }
  } else {
    ws.send(JSON.stringify({ "type": "error", "message": "No game available" }));
  }
}

function handleDisplay(ws, msg) {
  let clientWS = clients.find(c => c.clientId === msg.id);
  if (clientWS !== null) {
    switch (msg.type) {
      case 'weapon':
        console.log("reload: "+msg.reload);
        clientWS.send(JSON.stringify({
          type: 'weapon',
          name: msg.name,
          reload: msg.reload
        }));
        break;
      case 'death':
        clientWS.send(JSON.stringify({
          type: 'death',
          killedby: msg.killedby,
        }));
        break;
      default:
        console.log('unknown type '+JSON.stringify(msg));
    }
  } else {
    console.log(msg);
    ws.send(JSON.stringify({
      "type": "error",
      "message": "Client Id not present"
    }));
  }
}
