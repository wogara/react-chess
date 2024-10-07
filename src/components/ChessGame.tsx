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
}) => {
  const { getCurrentGame, resetGame, isGameOver, onDrop } = useChessGame(
    playerColor,
    sendMove,
    receivedMove,
  );

  const currentFen = getCurrentGame().fen();

  return (
    <div>
      <Chessboard
        position={currentFen}
        onPieceDrop={onDrop}
        boardOrientation={playerColor}
        customDarkSquareStyle={{ backgroundColor: colors.surface2 }}
        customLightSquareStyle={{ backgroundColor: colors.surface0 }}
      />
    </div>
  );
};

export default ChessGame;
