//@ts-nocheck

import React from "react";
import { useState } from "react";
interface SidebarProps {
  handleCreateRoom: () => void;
  handleJoinRoom: (roomId: string) => void;
  roomId: String;
  setRoomID: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  handleCreateRoom,
  handleJoinRoom,
  roomId,
  setRoomID,
}) => {
    const startGame = async () => {
    handleCreateRoom();
  };
  const joinGame = async () => {
    handleJoinRoom(roomId);
  };
  console.log('ROOM ID' + roomId);
  return (
    <div className="ml-4 p-6 bg-blue shadow-lg rounded-lg flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Game Room {roomId}
      </h2>

      <hr />

      <div className="flex flex-col w-full space-y-4">
        {" "}
        {/* Use flex column and space between buttons */}
        <button
          onClick={startGame}
          className="w-full bg-peach text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Start Game
        </button>
        <h2 className="text-lg font-semibold mb-6 text-center text-white">
          -- OR --
        </h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomID(e.target.value)}
          className="border border-gray-400 rounded-l py-3 px-4 w-full focus:outline-none focus:border-blue-500 transition duration-200"
        />
        <button
          onClick={joinGame}
          className="w-full bg-gray-300 text-black py-3 rounded hover:bg-gray-400 transition duration-200" // Different color for Join Game
        >
          Join Game
        </button>
      </div>

      <p className="text-gray-600 text-sm text-center mt-4">
        Join an existing game or start a new one!
      </p>
    </div>
  );
};

export default Sidebar;
