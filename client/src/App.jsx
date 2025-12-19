import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
    return (
        <div>
            <nav className="p-4 bg-gray-200 flex gap-4">
                <Link to="/" className="text-blue-600">Chat</Link>
                <Link to="/login" className="text-blue-600">Login</Link>
                <Link to="/register" className="text-blue-600">Register</Link>
            </nav>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;