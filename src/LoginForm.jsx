import React, { useState } from "react";
import { useAuth } from "./auth-context.jsx";

export default function LoginForm() {
  const { login, authLoading } = useAuth();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login({ username, password });
    if (!res.ok) setError(res.error || "Login failed");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <h1 className="mb-8 mt-8 mx-2 sm:mt-0 text-4xl md:text-5xl font-extrabold font-starwars text-yellow-400 text-center drop-shadow-lg tracking-wider">
        STAR WARS HOLO-NET
      </h1>
      <div className="bg-black/60 rounded-lg shadow-2xl border border-yellow-600 w-full max-w-md p-6">
        <h2 className="mb-5 text-2xl font-bold text-yellow-400 flex items-center gap-2 justify-center">
          <span>
            <svg
              height="1.4em"
              viewBox="0 0 24 24"
              fill="yellow"
              className="inline-block"
            >
              <circle cx="12" cy="12" r="12" />
              <circle cx="12" cy="12" r="4" fill="black" />
            </svg>
          </span>
          Login to the Galactic Archive
        </h2>
        <form onSubmit={submit} autoComplete="off">
          <div className="mb-4">
            <label
              className="block text-yellow-200 font-medium mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-yellow-100 border border-yellow-600 focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="e.g. demo"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-yellow-200 font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-yellow-100 border border-yellow-600 focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="e.g. password"
            />
          </div>
          {error && (
            <div className="text-red-500 mb-3 text-sm text-center font-semibold py-1 bg-red-900/40 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={authLoading}
            className="px-5 py-2 w-full mt-2 bg-yellow-400 text-gray-900 font-black rounded shadow hover:bg-yellow-300 hover:scale-105 transition-all duration-150 active:bg-yellow-500 active:scale-100 focus:outline-none"
            style={{ textShadow: "0 0 2px #000" }}
          >
            {authLoading ? (
              "Authenticating..."
            ) : (
              <span>
                <span className="mr-1">&#9737;</span>
                "Sign in"
              </span>
            )}
          </button>
        </form>
        <div className="text-xs text-yellow-700 mt-5 text-center opacity-70 select-none">
          Access is restricted to registered members of the Jedi Order.
          <br />
          Use <span className="font-mono">demo</span> /{" "}
          <span className="font-mono">password</span>.
        </div>
      </div>
      <style>{`
        @font-face {
          font-family: "starwars";
          src: local("Star Jedi"), url(https://fonts.cdnfonts.com/s/8525/Starjedi.woff) format('woff');
        }
        .font-starwars {
          font-family: starwars, Arial, sans-serif;
          letter-spacing: 0.12em;
        }
      `}</style>
    </div>
  );
}
