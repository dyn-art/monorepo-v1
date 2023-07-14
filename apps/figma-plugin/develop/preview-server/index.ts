import express, { Request, Response } from 'express';
import http from 'http';
import { Server, WebSocket } from 'ws';

const PORT = 9001;

// Create the express app
const app = express();

// Root route to check whether server is up and running
app.get('/', function (req: Request, res: Response) {
  res.status(200).send('running');
});

// Create HTTP server with the express app
const server = http.createServer(app);

// Create WebSocket server attached to the HTTP server
const wss = new Server({ server });

// Helper method to broadcast a message to all clients except the sender
function broadcastMessage(data: string, ws: WebSocket) {
  wss.clients.forEach(function (client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ data: data, type: 'server.broadcast' }));
    }
  });
}

// On 'connection' event, we setup the necessary WebSocket events
wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => broadcastMessage(message, ws));
});

// Helper method to check if each connection is still alive and responsive
function checkConnections() {
  wss.clients.forEach((ws) => {
    const isAliveTimeout = setTimeout(() => {
      ws.terminate();
    }, 10000);
    ws.ping();
    ws.once('pong', () => clearTimeout(isAliveTimeout));
  });
}

// Check connections every 10 seconds
setInterval(checkConnections, 10000);

// Start the server
server.listen(PORT, function () {
  console.log(`Server started on port: ${PORT}`);
});
