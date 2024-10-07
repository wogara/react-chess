// @ts-nocheck

import React from "react";
import { Chessboard } from "react-chessboard";
import useChessGame from "../hooks/useChessGame.ts";
import type { Move } from "chess.js";

interface ChessGameProps {
  playerColor: String;
  sendMove: (move: Move) => void;
  receivedMove: Move | null;
}

const ChessGame: React.FC<ChessGameProps> = ({
  playerColor,
  sendMove,
  receivedMove,
}) => {
    const { getCurrentGame, resetGame, isGameOver, onDrop} = useChessGame(playerColor,sendMove,receivedMove);


return (
<div>

    <Chessboard onPieceDrop={sendMove} boardOrientation={playerColor}/>
  </div>
)
  }

export default ChessGame;
