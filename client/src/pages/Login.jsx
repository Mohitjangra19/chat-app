import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'https://chat-app-dm9j.onrender.com/api/auth/login',
        { username, password }
      );

      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username)
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.msg);
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="p-8 bg-white rounded-lg shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
{/* Username Input */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 leading-tight text-white-700 border rounded shadow-sm"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                {/* Password Input */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 leading-tight text-white-700 border rounded shadow-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

        {/* --- NEW: ERROR MESSAGE --- */}
        {/* This is "conditional rendering". This <p> tag
            will ONLY be rendered if our 'error' state is not empty. */}
        {error && (
          <p className="mb-4 text-xs italic text-center text-red-500">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}