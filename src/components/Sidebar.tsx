//@ts-nocheck

import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
interface SidebarProps {
  handleCreateRoom: () => void;
  handleJoinRoom: (roomId: string) => void;
  roomId: String;
  setRoomID: () => void;
  onSendGameRequest: () => void;
  userData: {};
}
const Sidebar: React.FC<SidebarProps> = ({
  handleCreateRoom,
  handleJoinRoom,
  roomId,
  setRoomID,
  onSendGameRequest,
  userData,
}) => {
  console.log("SIDE BAR USER DATA EMAIL: " + userData.email);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userGames, setUserGames] = useState([]);
  useEffect(() => {
    console.log("FETCH USERS");

    const fetchUsers = async () => {
      try {
        // Check if the access_token is available
        if (!userData?.access_token) {
          console.error("No access token available");
          return;
        }

        const response = await fetch("https://chesswho.org/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.access_token}`, // Add Authorization header with Bearer token
            "Content-Type": "application/json", // Ensure proper content-type header
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const options = data
          .filter((user: { email: string }) => user.email !== userData.email) // Exclude logged-in user
          .map((user: { id: string; email: string }) => ({
            value: user.id,
            label: user.email,
          }));

        setUsers(options);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchUserGames = async () => {
      try {
        if (!userData?.email) {
          console.error("No email available to fetch games.");
          return;
        }

        const response = await fetch(
          `https://chesswho.org/api/games?email=${userData.email}`, // Adjust API endpoint to return games by email
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.access_token}`, // Add Authorization header
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserGames(data); // Assuming `data` contains a list of games associated with the user
      } catch (error) {
        console.error("Error fetching user games:", error);
      }
    };

    fetchUsers(); // Call the function to fetch users
    fetchUserGames();
  }, [userData]); // Depend on userData so that the effect reruns when userData changes

  const startGame = async () => {
    handleCreateRoom();
  };
  const joinGame = async () => {
    handleJoinRoom(roomId);
  };

  const handleSendRequest = () => {
    if (selectedUser) {
      console.log("selectedUser email" + selectedUser);
      onSendGameRequest(selectedUser.label); // Send email of selected user
    }
  };
  console.log("ROOM ID" + roomId);
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
          className="border border-gray-400 text-mantle rounded-l py-3 px-4 w-full focus:outline-none focus:border-blue-500 transition duration-200"
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
      {userData.email && (
        <>
          <h1 className="text-lg font-semibold mt-6 mb-6 text-center text-white">
            -- OR --
          </h1>

          <div className="w-full text-black">
            <Select
              options={users}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select a user..."
              isSearchable
              className="w-full"
            />
            {selectedUser && (
              <p className="text-black text-sm text-center mt-4">
                Selected User: {selectedUser.label}
              </p>
            )}
          </div>

          <button
            onClick={handleSendRequest}
            className="w-full bg-gray-300 text-black py-3 mt-4 rounded hover:bg-gray-400 transition duration-200"
            disabled={!selectedUser}
          >
            Send Game Request
          </button>

          {/* Display games associated with the user */}
          <div className="w-full text-white mt-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Your Games with Friends
            </h2>
            <ul className="text-sm text-center">
              {userGames.length > 0 ? (
                userGames
                  .filter(
                    (game: { white_email: string; black_email: string }) =>
                      game.white_email && game.black_email, // Only include games where both emails are present
                  )
                  .map(
                    (game: {
                      id: string;
                      white_email: string;
                      black_email: string;
                    }) => {
                      const isWhite = game.white_email === userData.email;
                      const opponentEmail = isWhite
                        ? game.black_email
                        : game.white_email;
                      const opponentColor = isWhite ? "Black" : "White";

                      const gameBgClass =
                        game.id === roomId ? "bg-green" : "hover:bg-gray-300";

                      return (
                        <li
                          key={game.id}
                          className={`mb-2 cursor-pointer ${gameBgClass} text-bold text-mantle transition duration-200 p-2 rounded`} // Make the list item clickable and styled
                          onClick={() => handleJoinRoom(game.id)} // Invoke handleJoinRoom when clicked
                        >
                          Game ID: {game.id} - Opponent: {opponentEmail} as{" "}
                          {opponentColor}
                        </li>
                      );
                    },
                  )
              ) : (
                <li>You have no games.</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
