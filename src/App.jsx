import React from "react";
import { useAuth } from "./auth-context.jsx";
import LoginForm from "./LoginForm";
import StarWarsCharacters from "./components/StarWarsCharacters.jsx";

export default function App() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-black text-gray-100">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-black text-gray-100">
      <header className="flex justify-between items-center text-white p-4">
        <h1 className="text-xl font-bold text-yellow-400">
          Star Wars Explorer
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-1.5 sm:px-3 py-0.5 sm:py-1 rounded"
        >
          Logout
        </button>
      </header>
      <StarWarsCharacters />
    </div>
  );
}
