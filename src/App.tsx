//@ts-nocheck

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import Register from "./components/Register";

import { useEffect, useState } from "react";
import "./App.css";
import ChessRoom from "./components/ChessRoom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
//import authService from "./services/authService";

function App() {
  interface ApiResponse {
    message: string;
  }
  const [roomId, setRoomId] = useState("");
  const [playerColor, setPlayerColor] = useState("white");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStateData, setUserStateData] = useState({});

  const handleLogin = () => {
    setIsAuthenticated(true);
    const userData = localStorage.getItem("user");
    // Check if userData is not null
    if (userData) {
      // Parse the JSON string back into an object
      const parsedUserData = JSON.parse(userData);
      // Use the spread operator to set the user data
      setUserStateData((prevData) => ({
        ...prevData, // Preserve existing user data
        ...parsedUserData, // Add the new user data
      }));
      console.log("User data:", parsedUserData);
    }
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  const handleSendGameRequest = (username) => {
    if (!isAuthenticated) {
      alert("You must be logged in to send game requests.");
      return;
    }
    // Logic to send game request to the specified user
    console.log(`Game request sent to ${username}`);
  };

  const handleCreateRoom = async () => {
    console.log("Attempting to create a room...");
    try {
      const response = await fetch(
        "https://chesswho.org/api/create-room",
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
        const response = await fetch("https://chesswho.org/api/message");
        const data: ApiResponse = await response.json();
        console.log(data.message);
      } catch (error: any) {
        console.error("Error fetching api/message", error);
      }
    };

    fetchTest();
  }, []);

  const handleLogout = () => {
    //authService.logout(); // Uncomment this when you have a logout service
    localStorage.removeItem("user"); // Clear user data from local storage
    setIsAuthenticated(false); // Update authentication state
    setUserStateData({}); // Reset user data
  };
  return (
    <Router>
      <Navbar onLogout={handleLogout} userData={userStateData} />

      <Routes>
        <Route
          path="/signin"
          element={<SignIn userData={userStateData} onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={
            <Register userData={userStateData} onRegister={handleRegister} />
          }
        />
        <Route
          path="/"
          element={
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
                    onSendGameRequest={handleSendGameRequest} // Pass function to Sidebar
                    userData={userStateData}
                  />
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
