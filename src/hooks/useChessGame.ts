//@ts-nocheck

import { useState, useCallback, useEffect } from "react";
import { Chess, Move } from "chess.js";

const useChessGame = (
  playerColor: String,
  sendMove?: (from: String, to: String) => void,
  receivedMove?: Move | null,
) => {
  console.log("USE CHESS GAME RECEIVED MOVE" + receivedMove);
  const [game, setGame] = useState(new Chess());
  const [player, setPlayer] = useState(playerColor);

  const getCurrentGame = useCallback(() => {
    return game;
  }, [game]);

  const undoMove = useCallback(() => {});

  const makeAMove = useCallback(
    ({
      from,
      to,
      promotion,
    }: {
      from: string;
      to: string;
      promotion?: string;
    }) => {
      console.log("GOT INTO MAKE MOVE");
      const currentGame = getCurrentGame();

      try {
        const result = currentGame.move({ from, to, promotion });

        if (result) {
          console.log("INSIDE RESULT");
          const pgn = currentGame.pgn();
          const newGame = new Chess();
          newGame.loadPgn(pgn);
          setGame(newGame);
          return true; // Move was successful
        } else {
          console.log("Invalid move");
          return false; // Move failed (e.g., invalid move)
        }
      } catch (error) {
        console.error("Move failed with error:", error);
        return false; // Return false if an exception occurs
      }
    },
    [getCurrentGame],
  );

  const onDrop = useCallback(
    (from: string, to: string) => {
      if (
        (game.turn() === "w" && playerColor === "white") ||
        (game.turn() === "b" && playerColor === "black")
      ) {
        const move = makeAMove({
          from: from,
          to: to,
        });
        if (move === null) {
          return false;
        }
        if (sendMove) {
          sendMove(from, to);
        }
        return true;
      } else {
        return false;
      }
    },
    [game, playerColor, makeAMove, sendMove],
  );

  // UseEffect to handle the receivedMove
  useEffect(() => {
    if (receivedMove) {
      console.log("Received Move:", receivedMove);

      // Only make the move if from and to are defined
      if (receivedMove.from && receivedMove.to) {
        console.log("INSIDE IF " + receivedMove);
        makeAMove(receivedMove);
      } else {
        console.error("Invalid move received:", receivedMove);
      }
    }
  }, [receivedMove, makeAMove]);

  const resetGame = useCallback(() => {
    setGame(new Chess());
  });

  const isGameOver = useCallback(() => {
    return game.isGameOver() || game.isDraw();
  });

  return { getCurrentGame, makeAMove, resetGame, isGameOver, onDrop, undoMove };
};

export default useChessGame;
