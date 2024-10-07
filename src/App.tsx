import { useEffect, useState } from "react";
import "./App.css";
import ChessRoom from "./components/ChessRoom";
import Sidebar from "./components/Sidebar";

function App() {
  interface ApiResponse {
    message: string;
  }
  const [roomId, setRoomId] = useState("");
  const [playerColor, setPlayerColor] = useState("white");

  const handleCreateRoom = async () => {
    console.log("Attempting to create a room...");
    try {
      const response = await fetch(
        "https://chesswho.org" + "/api/create-room",
        { method: "POST" },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Room created successfully:", data.roomID);
      setRoomId(data.roomID);
      setPlayerColor("white"); // Creator is white
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  // Logic for joining a room can set player color to black
  const handleJoinRoom = (roomID: string) => {
    setRoomId(roomID);
    setPlayerColor("black"); // New joiner is black
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch("https://chesswho.org" + "/api/message");
        const data: ApiResponse = await response.json();
        console.log(data.message);
      } catch (error: any) {
        console.error("Error fetching api/message", error);
      }
    };

    fetchTest();
  }, []);
  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="flex max-w-screen-lg w-full">
          <div className="flex-grow w-2/3">
            <ChessRoom roomId={roomId} playerColor={playerColor} />
          </div>
          <div className="w-1/3">
            <Sidebar
              handleCreateRoom={handleCreateRoom}
              handleJoinRoom={handleJoinRoom}
              roomId={roomId}
              setRoomID={setRoomId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
