const app = require('express')();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});
const pantalla1 = require('./pantalla1');

const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send(pantalla1.pantallaFlujo);
});

setInterval(function () {
  pantalla1.updateFlujo();
  const { flujo, tiempo } = pantalla1.pantallaFlujo[0];
  io.sockets.emit('push', `${flujo},${tiempo}`);
}, 1000);

io.on('connection', function (socket) {
  console.log('hello! bro');
});

http.listen(port, () => {
  console.log(`Ready!! Listening on *:${port}`);
});