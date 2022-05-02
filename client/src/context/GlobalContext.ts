import { createContext } from 'react';

export interface IGlobalContextProps {
  isInRoom: boolean;
  setIsInRoom: (isInRoom: boolean) => void;
  playerSymbol: 'x' | 'o';
  setPlayerSymbol: (playerSymbol: 'x' | 'o') => void;
  isPlayerTurn: boolean;
  setIsPlayerTurn: (isPlayerTurn: boolean) => void;
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
}

const defaultState: IGlobalContextProps = {
  isInRoom: false,
  setIsInRoom: () => {},
  playerSymbol: 'x',
  setPlayerSymbol: () => {},
  isPlayerTurn: false,
  setIsPlayerTurn: () => {},
  isGameStarted: false,
  setIsGameStarted: () => {},
};

export default createContext(defaultState);
