import { Socket } from 'socket.io-client';

import { GameMatrix, IStartGame } from './../../components/game/Board';

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit('join_room', { roomId });

      socket.on('room_full', (data: any) => {
        reject(data);
      });

      socket.on('room_joined', () => {
        resolve(true);
      });
    });
  }

  public async updateGame(socket: Socket, gameMatrix: GameMatrix) {
    socket.emit('update_game', { matrix: gameMatrix });
  }

  public async onGameUpdate(
    socket: Socket,
    callback: (matrix: GameMatrix) => void
  ) {
    socket.on('on_game_update', ({ matrix }) => callback(matrix));
  }

  public async onGameStart(
    socket: Socket,
    callback: (options: IStartGame) => void
  ) {
    socket.on('start_game', (options: IStartGame) => callback(options));
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit('game_win', { message });
  }

  public async onGameWin(socket: Socket, callback: (message: string) => void) {
    socket.on('on_game_win', (data: any) => callback(data.message));
  }
}

export default new GameService();
