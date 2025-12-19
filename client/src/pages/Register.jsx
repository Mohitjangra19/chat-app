import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const userData = {
                username: username,
                password: password,
            };
            const response = await axios.post(
                'https://chat-app-dm9j.onrender.com/api/auth/register',
                userData
            );


            console.log('Registration successful !');
            console.log('Server response:', response.data);
            console.log('Your token is:', response.data.token);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            navigate('/');
        }
        catch (error) {

            console.error('Registration failed');
            console.error(error);

            if (error.response) {
                console.error('Server response:', error.response.data);
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                className="p-8 bg-white rounded-lg shadow-md w-96"
                onSubmit={handleSubmit}
            >
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Create New Account
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
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

