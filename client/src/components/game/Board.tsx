import { useState, useContext, useEffect } from 'react';

import GlobalContext from '../../context/GlobalContext';

import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

import Row from './Row';
import Cell from './Cell';

import './Board.css';

export type GameMatrix = Array<Array<string | null>>;
export interface IStartGame {
  start: boolean;
  symbol: 'x' | 'o';
}

export default function Board() {
  const [matrix, setMatrix] = useState<GameMatrix>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const {
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setIsPlayerTurn,
    isGameStarted,
    setIsGameStarted,
  } = useContext(GlobalContext);

  const checkGameState = (matrix: GameMatrix) => {
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every(value => value && value === playerSymbol)) {
        alert(`Zmagali ste! Čestitke!`);
        return [true, false];
      } else if (row.every(value => value && value !== playerSymbol)) {
        alert(`Izgubili ste! Več sreče prihodnjič!`);
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every(value => value && value === playerSymbol)) {
        alert(`Zmagali ste! Čestitke!`);
        return [true, false];
      } else if (column.every(value => value && value !== playerSymbol)) {
        alert(`Izgubili ste! Več sreče prihodnjič!`);
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) {
          alert(`Zmagali ste! Čestitke!`);
          return [true, false];
        } else {
          alert(`Izgubili ste! Več sreče prihodnjič!`);
          return [false, true];
        }
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) {
          alert(`Zmagali ste! Čestitke!`);
          return [true, false];
        } else {
          alert(`Izgubili ste! Več sreče prihodnjič!`);
          return [false, true];
        }
      }
    }

    //Check for a tie
    if (matrix.every(m => m.every(v => v !== null))) {
      alert('Igra je zaključena! Nihče ni zmagovalec!');
      return [true, true];
    }

    return [false, false];
  };

  const updateGameMatrix = (
    rowIndex: number,
    cellIndex: number,
    value: 'x' | 'o'
  ) => {
    const newMatrix: GameMatrix = [...matrix];

    if (
      newMatrix[rowIndex][cellIndex] === null ||
      newMatrix[rowIndex][cellIndex] === 'null'
    ) {
      newMatrix[rowIndex][cellIndex] = value;
      setMatrix(newMatrix);
    } else {
      return;
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, newMatrix);
      setIsPlayerTurn(false);
    }
  };

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, newMatrix => {
        setMatrix(newMatrix);
        setIsPlayerTurn(true);
      });
    }
  };

  const handleGameStart = () => {
    if (socketService.socket) {
      gameService.onGameStart(
        socketService.socket,
        ({ start, symbol }: IStartGame) => {
          setIsGameStarted(true);
          setPlayerSymbol(symbol);
          setIsPlayerTurn(start);
        }
      );
    }
  };

  useEffect(() => {
    console.log(socketService);
    handleGameUpdate();
    handleGameStart();
  }, []);

  useEffect(() => {
    const [player1, player2] = checkGameState(matrix);

    if (player1 || player2) {
      setIsGameStarted(false);
      setIsPlayerTurn(false);
    }
  }, [matrix]);

  return (
    <div className="board">
      <p className="info-text">{`Igralec: ${playerSymbol}`}</p>

      {!isGameStarted && (
        <p className="info-text">
          Čakanje na pridružitev drugega igralca, za začetek igre.
        </p>
      )}
      {(!isGameStarted || !isPlayerTurn) && (
        <div className="player-stopper"></div>
      )}
      {matrix.map((row, rowIndex) => (
        <Row key={rowIndex} rowIndex={rowIndex}>
          {row.map((cell, cellIndex) => (
            <Cell
              onClick={(ri: number, ci: number) =>
                updateGameMatrix(ri, ci, playerSymbol)
              }
              key={cellIndex}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
            >
              {cell}
            </Cell>
          ))}
        </Row>
      ))}
    </div>
  );
}
