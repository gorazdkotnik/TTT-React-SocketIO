import { Server } from 'socket.io';

export default (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // connection handler
  io.on('connection', function (socket: any) {
    console.log('a user connected', socket.id);

    // room handler
    socket.on('join_room', async function (data: { roomId: string }) {
      console.log('join room', data);

      const connectedSockets = io.sockets.adapter.rooms.get(data.roomId);
      const socketRooms = Array.from(socket.rooms.values()).filter(
        r => r !== socket.id
      );

      if (
        socketRooms.length > 0 ||
        (connectedSockets && connectedSockets.size == 2)
      ) {
        socket.emit('room_full', {
          error: 'Soba je polna. Prosimo izberite drugo sobo.',
        });
      } else {
        await socket.join(data.roomId);
        socket.emit('room_joined');

        if (io.sockets.adapter.rooms.get(data.roomId)?.size == 2) {
          socket.emit('start_game', { start: true, symbol: 'x' });
          socket
            .to(data.roomId)
            .emit('start_game', { start: false, symbol: 'o' });
        }
      }
    });

    // update game handler
    socket.on('update_game', async function (data: any) {
      const socketRooms = Array.from(socket.rooms.values()).filter(
        r => r !== socket.id
      );
      const gameRoom = socketRooms && socketRooms[0];

      socket.to(gameRoom).emit('on_game_update', data);
    });

    // game win handler
    socket.on('game_win', async function (data: any) {
      const socketRooms = Array.from(socket.rooms.values()).filter(
        r => r !== socket.id
      );
      const gameRoom = socketRooms && socketRooms[0];

      socket.to(gameRoom).emit('on_game_win', data);
    });
  });

  return io;
};
