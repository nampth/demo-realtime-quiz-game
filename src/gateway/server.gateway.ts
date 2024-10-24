import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })  // Enable CORS for client connections
export class ServerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private logger: Logger = new Logger('MyGateway');

    @WebSocketServer()
    server: Server;  // Access to the Socket.IO server instance

    // Gateway initialization (optional)
    afterInit(server: Server) {
        this.logger.log('Socket.IO Server Initialized');
    }

    // Called when a client connects
    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        // Emit an event to the connected client
        client.emit('welcome', 'Hello Client! You are connected.');
    }

    // Called when a client disconnects
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    // Subscribe to an event sent by the client (e.g., 'message' event)
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
        this.logger.log(`Message received: ${message}`);

        // You can interact with the client using client.emit()
        client.emit('response', `Message received: ${message}`);

        // Or broadcast to all connected clients using server.emit()
        this.server.emit('broadcast', `Client ${client.id} sent: ${message}`);
    }
}
