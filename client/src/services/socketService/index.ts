import { Socket, io } from 'socket.io-client';

class SocketService {
  public socket: Socket | null = null;

  public connect(url: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      if (!this.socket) return reject(new Error('Socket connection failed'));

      this.socket.on('connect', () => {
        resolve(this.socket as Socket);
      });

      this.socket.on('connect_error', (error: any) => {
        reject(error);
      });
    });
  }
}

export default new SocketService();
