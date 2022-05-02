import React, { useState, useContext } from 'react';
import GlobalContext from '../../context/GlobalContext';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

import './JoinRoom.css';

interface iJoinRoomProps {}

export default function JoinRoom(props: iJoinRoomProps) {
  const { isInRoom, setIsInRoom } = useContext(GlobalContext);

  const [roomName, setRoomName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const onChangeRoomNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const joinRoom = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const socket = socketService.socket;

      if (!roomName || roomName.trim() === '' || !socket || isJoining) {
        return;
      }

      setIsJoining(true);

      const joined = await gameService.joinGameRoom(socket, roomName);

      if (joined) {
        setIsInRoom(true);
      }

      setIsJoining(false);
    } catch (error: any) {
      alert(error.error);
      setIsJoining(false);
    }
  };

  return (
    <div className="join-room-container">
      <h2 className="join-room-title">Pridružite se sobi</h2>
      <form onSubmit={joinRoom}>
        <div className="form-control">
          <label>Ime Sobe</label>
          <input
            type="text"
            placeholder="Vnesite ime sobe"
            onChange={onChangeRoomNameHandler}
            value={roomName}
          />
        </div>
        <button type="submit" disabled={isJoining}>
          {isJoining ? 'Vstopanje v sobo...' : 'Pridruži se'}
        </button>
      </form>
    </div>
  );
}
