// @ts-nocheck

import React from "react";
import { Chessboard } from "react-chessboard";
import useChessGame from "../hooks/useChessGame.ts";
import type { Move } from "chess.js";
import { colors } from "../utils/colors";

interface ChessGameProps {
  playerColor: String;
  sendMove: (from: String, to: String) => void;
  receivedMove: Move | null;
}

const ChessGame: React.FC<ChessGameProps> = ({
  playerColor,
  sendMove,
  receivedMove,
  initialMoves,
}) => {

  console.log("CHESS GAME RERENDER");
  const { getCurrentGame, resetGame, isGameOver, onDrop } = useChessGame(
    playerColor,
    sendMove,
    receivedMove,
    initialMoves,
  );

  const currentFen = getCurrentGame().fen();

  return (
    <div>
      <Chessboard
        position={currentFen}
        onPieceDrop={onDrop}
        boardOrientation={playerColor}
        customDarkSquareStyle={{ backgroundColor: colors.surface0 }}
        customLightSquareStyle={{ backgroundColor: colors.surface2 }}
      />
    </div>
  );
};

export default ChessGame;
