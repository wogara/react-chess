//@ts-nocheck

import { useState, useCallback, useEffect } from "react";
import { Chess, Move } from "chess.js";

const useChessGame = (
  playerColor: String,
  sendMove?: (from: String, to: String) => void,
  receivedMove?: Move | null,
  initialMoves?: Array<any>,
) => {
  const [game, setGame] = useState(new Chess());
  const [player, setPlayer] = useState(playerColor);
  const [soundUrl, setSoundUrl] = useState("");
  const moveURL =
    "http://drupal.chesswho.org/sites/default/files/2024-10/move-self.mp3";
  const captureURL =
    "http://drupal.chesswho.org/sites/default/files/2024-10/capture.mp3";
  const checkURL =
    "http://drupal.chesswho.org/sites/default/files/2024-10/move-check.mp3";
  const castleURL =
    "http://drupal.chesswho.org/sites/default/files/2024-10/castle.mp3";

  useEffect(() => {
    if (Array.isArray(initialMoves)) {
      const newGame = new Chess();
      initialMoves.forEach((move) => {
        newGame.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
      });
      setGame(newGame); // Set the game with the loaded moves
    }
  }, [initialMoves]);

  const playChessSound = () => {
    const audio = new Audio(moveURL);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };

  const getCurrentGame = useCallback(() => {
    return game;
  }, [game]);

  const undoMove = useCallback(() => { });

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
      const currentGame = getCurrentGame();

      try {
        const result = currentGame.move({ from, to, promotion });

        if (result) {
          const pgn = currentGame.pgn();
          const newGame = new Chess();
          newGame.loadPgn(pgn);
          setGame(newGame);
          playChessSound();
          return true; // Move was successful
        } else {
          return false; // Move failed (e.g., invalid move)
        }
      } catch (error) {
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

      // Only make the move if from and to are defined
      if (receivedMove.from && receivedMove.to) {
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
