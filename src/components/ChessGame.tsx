// @ts-nocheck

import React from "react";
import { Chessboard } from "react-chessboard";
import useChessGame from "../hooks/useChessGame.ts";
import type { Move } from "chess.js";

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
    const { getCurrentGame, resetGame, isGameOver, onDrop} = useChessGame(playerColor,sendMove,receivedMove);

  const currentFen = getCurrentGame().fen();

  console.log("CURRENT FEN : " + currentFen);


return (
<div>

    <Chessboard position={currentFen} onPieceDrop={onDrop} boardOrientation={playerColor}/>
  </div>
)
  }

export default ChessGame;
