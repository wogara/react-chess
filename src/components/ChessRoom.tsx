import React, { useState, useEffect } from "react";

import ChessGame from "./ChessGame";
import { Move } from "chess.js";

import Pusher from "pusher-js";
import Echo from "laravel-echo";
//add these
declare global {
  interface Window {
    Pusher: any;
    Echo: Echo;
  }
}
window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: "reverb",
  key: "mhvvze3aillswjz0nq5q",
  wsHost: 'chesswho.org',
  wsPort: 8080,
  forceTLS: true,
  encrypted: true,
  enabledTransports: ["ws","wss"],
  authEndpoint: "https://chesswho.org/broadcasting/auth",
  auth: {
    headers: {
    },
  },
});

interface ChessRoomProps {
  roomId: String;
  playerColor: String;
}
const ChessRoom: React.FC<ChessRoomProps> = ({ playerColor, roomId }) => {
  console.log("PLAYER COLOR: " + playerColor);
  useEffect(() => {
    if (!roomId.length){
      console.log("NO ROOM ID");
      return;
    }

    console.log("LISTEN FOR CHANNEL: " + roomId);
   const channel = window.Echo.channel(`public-channel`).listen(
      "MoveEvent",
      (e: any) => {
        console.log("EVENT");
        console.log("IDK event received:", e);
      },
    );

    return () => {
      channel.stopListening("MoveEvent");
    };
  }, [roomId]);

  const [receivedMove] = useState(null); 

  useEffect(() => {
    //initialize socket.io client
  }, [playerColor]);
  const sendMove = (move: Move) => {
    console.log("sendMove hit");
    console.log("MOVE" + move);
    //    socket.emit("makeMove", { roomNumber, move });
    //
    //window.Echo.private(`my-private-channel.user.1`).whisper('MoveEvent', {
   // move: 'hey',
  //});
    
  };

  return (
    <div>
      <h4>Playing as {playerColor}</h4>
      <ChessGame
        playerColor={playerColor}
        sendMove={sendMove}
        receivedMove={receivedMove}
      />
    </div>
  );
};

export default ChessRoom;
