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
  const [fetchedMoves, setFetchedMoves] = useState([]);

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

  const handleCreateRoom = async () => {
    console.log("Attempting to create a room...");
    try {
      const response = await fetch("https://chesswho.org/api/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ white_email: userStateData.email }),
      });

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
  const handleSendGameRequest = async (username) => {
    //username is the email
    if (userStateData.email) {
      try {
        const response = await fetch("https://chesswho.org/api/create-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            white_email: userStateData.email,
            black_email: username,
          }),
        });

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
    }

    return;
  };

  // Logic for joining a room can set player color to black
  const handleJoinRoom = async (roomID: string) => {
    console.log("handle join room");
    try {
      // Fetch the moves from the API using roomID as game_id
      const response = await fetch(
        `https://chesswho.org/api/moves?game_id=${roomID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Assuming data.moves contains the list of moves
      console.log("Moves fetched successfully:", data.moves);
      //data.moves looks like [{from: 'e2', to: 'e4', played_by: 'white', promotion: 'no'}];;
      setFetchedMoves(data.moves);
      if (data.white_email) {
        if (data.white_email === userStateData.email) {
          setPlayerColor("white");
        } else {
          setPlayerColor("black");
        }
      } else {
        setPlayerColor("black");
      }
    } catch (error) {
      console.error("Failed to fetch moves:", error);
    }

    setRoomId(roomID);
    // setPlayerColor("black"); // New joiner is black
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
  // Load authentication and user data from localStorage when the app mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem("user");

    console.log("STORE USER DATA REFFRESH");

    if (storedUserData) {
      setUserStateData(JSON.parse(storedUserData));
    }
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
      <div className="pt-2">
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
                    <ChessRoom
                      initialMoves={fetchedMoves}
                      roomId={roomId}
                      playerColor={playerColor}
                    />
                  </div>
                  <div className="w-1/3 h-full overflow-y-auto">
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
      </div>
    </Router>
  );
}

export default App;
