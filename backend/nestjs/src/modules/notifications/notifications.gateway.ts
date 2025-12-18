import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<string, string[]> = new Map();

  handleConnection(client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      const existingSockets = this.userSockets.get(userId) || [];
      existingSockets.push(client.id);
      this.userSockets.set(userId, existingSockets);
      client.join(`user:${userId}`);
      this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      const sockets = this.userSockets.get(userId) || [];
      const updatedSockets = sockets.filter((id) => id !== client.id);
      if (updatedSockets.length > 0) {
        this.userSockets.set(userId, updatedSockets);
      } else {
        this.userSockets.delete(userId);
      }
      this.logger.log(`Client disconnected: ${client.id} for user: ${userId}`);
    }
  }

  private getUserIdFromSocket(client: Socket): string | null {
    // Get userId from handshake auth or query
    return (
      client.handshake.auth?.userId ||
      (client.handshake.query?.userId as string) ||
      null
    );
  }

  // Send notification to a specific user
  sendToUser(userId: string, notification: any): void {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.log(`Notification sent to user: ${userId}`);
  }

  // Send notification to all connected users
  broadcast(notification: any): void {
    this.server.emit('notification', notification);
    this.logger.log('Broadcast notification sent');
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
