//@ts-nocheck

import React from "react";
import { useState } from "react";
interface SidebarProps {
  handleCreateRoom: () => void;
  handleJoinRoom: (roomId: string) => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  handleCreateRoom,
  handleJoinRoom,
}) => {

  const [roomID, setRoomID] = useState("");
  const startGame = async () => {
    handleCreateRoom();
  };
  const joinGame = async() => {
    handleJoinRoom(roomID);
  }
  return (
    <div className="ml-4 p-4 bg-gray-100 justify-center items-center">
      <h2 className="text-xl mb-4 text-center">Sidebar</h2>
      <button
        onClick={startGame}
        className="w-full bg-blue-500 text-white py-2 mb-2 rounded"
      >
        Start Game
      </button>
      <div className="flex w-full">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomID}
          onChange={(e:any) => setRoomID(e.target.value)}
          className="border border-gray-300 rounded-l py-2 px-3 w-3/4"
        />
        <button onClick={joinGame} className="w-full bg-blue-500 text-white py-2 rounded">
          Join Game
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
