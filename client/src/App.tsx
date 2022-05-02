import { useEffect, useState } from 'react';

import GlobalContext, { IGlobalContextProps } from './context/GlobalContext';
import socketService from './services/socketService';

import Container from './components/UI/Container';

import JoinRoom from './components/rooms/JoinRoom';
import Board from './components/game/Board';

function App() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<'x' | 'o'>('x');
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const connectSocket = async () => {
    try {
      const socket = await socketService.connect('http://localhost:3001');
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    connectSocket();
  }, []);

  const globalContextValue: IGlobalContextProps = {
    isInRoom,
    setIsInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setIsPlayerTurn,
    isGameStarted,
    setIsGameStarted,
  };

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <Container>
        <h1 className="welcome-title">Dobrodošli v Tic-Tac-Toe Multiplayer</h1>
        {!isInRoom && <JoinRoom />}
        {isInRoom && <Board />}
      </Container>
    </GlobalContext.Provider>
  );
}

export default App;
