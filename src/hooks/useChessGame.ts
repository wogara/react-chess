//@ts-nocheck

import { useState, useCallback } from "react";
import { Chess, Move } from "chess.js";

const useChessGame = (
  playerColor: String,
  sendMove?: (move: Move) => void,
  receivedMove?: Move | null,
) => {
  const [game, setGame] = useState(new Chess());
  const [player, setPlayer] = useState(playerColor);

  const getCurrentGame = useCallback(() => {
    return game;
  }, [game]);

  const undoMove = useCallback(() => {
    //const pgn = game.pgn();
    //const newGame = new Chess();
    //newGame.load_pgn(pgn);
  });

  const makeAMove = useCallback(
    (move: Move) => {
      const currentGame = getCurrentGame();
      const result = currentGame.move(move);
      if (result) {
        const pgn = currentGame.pgn();
        const newGame = new Chess();
        newGame.loadPgn(pgn);
        newGame.move(move);
        setGame(newGame);
      }
      return result;
    },
    [getCurrentGame],
  );

  const onDrop = useCallback(
    (move: Move) => {
      if (sendMove) {
        sendMove(move);
      }
    },
    [sendMove],
  );

  if (receivedMove) {
    makeAMove(receivedMove);
  }

  const resetGame = useCallback(() => {
    setGame(new Chess());
  });

  const isGameOver = useCallback(() => {
    return game.isGameOver() || game.isDraw();
  });

  return { getCurrentGame, makeAMove, resetGame, isGameOver, onDrop, undoMove };
};

export default useChessGame;
