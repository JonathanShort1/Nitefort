let express = require('express');
let _app = express();
let bodyParser = require("body-parser");
let expressWs = require('express-ws')(_app);
let fs = require("fs");
let https = require("https");



// let privateKey  = fs.readFileSync('key.pem', 'utf8');
// let certificate = fs.readFileSync('cert.pem', 'utf8');
//
// let credentials = {key: privateKey, cert: certificate};
//
//
//
//
// let clients = [];
// let games = [];
// let client_id = 0;
// let game_id = 0;

let app = express.Router();

_app.use('/',app);
_app.use('/nitefort',app);

app.use("/display", express.static("display"));
app.use(bodyParser.json());

// ==================================================
// THE WEBSOCKET COMMUNICATION
// ==================================================

app.ws("/user", function(ws, req) {
  ws.on("open", function() {
    console.log("connection made!");
    ws.user_id = client_id;
    clients.push(ws);
    client_id += 1;
  });

  ws.on("message", function(msg) {
    console.log("Message received");
    console.log(JSON.stringify(msg));
    handleClient(ws, msg, clients);
  });

  ws.on("close", function() {
    console.log("client leaving");
    let index = clients.indexof(ws);
    clients.splice(index, 1);
  });
});

app.ws("/display", function(ws, req) {
  ws.on("open", function() {
    console.log("display connected!");
    ws.display_id = game_id;
    games.push(ws);
    game_id += 1;
  });

  ws.on("message", function(msg) {
    console.log("Message received");
    console.log(JSON.stringify(msg));
    handleDisplay(ws, msg, clients);
  });

  ws.on("close", function() {
    console.log("display disconnected");
    let index = games.indexof(ws);
    games.splice(index, 1);
  })
});


/**
 * Log any server-side errors to the console and send 500 error code.
 */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

//pass in your express app and credentials to create an https server
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(21067);
_app.listen(21067);
console.log('Server running, access game by going to http://138.251.206.220:21067/Nitefort/game.html');


// ==================================================
// IMPLEMENT THE API AND WEBSOCKET COMMUNICATION HERE
// ==================================================
