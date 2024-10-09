//@ts-nocheck

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
  wsHost: "chesswho.org",
  wsPort: 8080,
  forceTLS: true,
  encrypted: true,
  enabledTransports: ["ws", "wss"],
  authEndpoint: "https://chesswho.org/broadcasting/auth",
  auth: {
    headers: {},
  },
});

interface ChessRoomProps {
  roomId: String;
  playerColor: String;
}
const ChessRoom: React.FC<ChessRoomProps> = ({ playerColor, roomId, initialMoves }) => {
  const [receivedMove, setReceivedMove] = useState(null);

  useEffect(() => {
    if (!roomId.length) {
      console.log("NO ROOM ID");
      return;
    }

    console.log("LISTEN FOR CHANNEL: " + roomId);
    const channel = window.Echo.channel(`public-channel`).listen(
      "MoveEvent",
      (e: any) => {
        console.log("EVENT");
        console.log("IDK event received:", e);
        console.log(e.data.from);
        setReceivedMove({ from: e.data.from, to: e.data.to });
      },
    );

    return () => {
      channel.stopListening("MoveEvent");
    };
  }, [roomId]);

  useEffect(() => {
    //initialize socket.io client
  }, [playerColor]);
  const sendMove = async (from: String, to: String) => {
    //
    console.log("Attempting to send move..." + roomId);
    console.log("MOVE from: " + from + " to: " + to);
    try {
      const response = await fetch("https://chesswho.org/api/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type
          Accept: "application/json", // Ensure the server returns JSON
        },
        body: JSON.stringify({
          // Pass in any necessary data for creating the room, for example:
          game_id: roomId,
          from: from,
          to: to,
          played_by: playerColor,
          promotion: "no",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("move sent successfully:", data);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <div>
      <ChessGame
        initialMoves={initialMoves}
        playerColor={playerColor}
        sendMove={sendMove}
        receivedMove={receivedMove}
      />
    </div>
  );
};

export default ChessRoom;
