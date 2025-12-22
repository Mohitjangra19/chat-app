import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("https://chat-app-dm9j.onrender.com");

export default function Chat() {
    
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const myUsername = localStorage.getItem('username');

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                author: myUsername,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get("https://chat-app-dm9j.onrender.com/api/messages");
                const messages = response.data.map(msg => ({
                    author: msg.username,
                    message: msg.message,
                    time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setMessageList(history);
            } catch (err) {
                console.error("error fetching messages:", err);
            }
        };

        fetchMessages();
        const receiveMessageListener = (data) => {
            setMessageList((list) => [...list, data]);
        };
        socket.on("receive_message", receiveMessage);
        return () => {
            socket.off("receive_message", receiveMessageListener);
        };
    }, [socket]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-96 bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-blue-600 p-4 text-white font-bold">
          Live Chat
        </div>

        {/* Chat Body (Message List) */}
        <div className="h-64 overflow-y-auto p-4 bg-gray-50 border-b">
          {messageList.map((msg, index) => {
            const isMyMessage = msg.author === myUsername;

            return (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded w-fit ${
                  isMyMessage ? "bg-blue-500 ml-auto text-right" : "bg-green-500 text-left"
                }`}
              >
                <p className="font-bold text-xs">{msg.author}</p>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-500 text-right">{msg.time}</p>
              </div>
            );
          })}
        </div>

        {/* Chat Footer (Input) */}
        <div className="p-4 flex">
          <input
            type="text"
            className="flex-1 border rounded p-2 mr-2"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
          />
          <button 
            onClick={sendMessage}
            className="bg-blue-600 text-white p-2 rounded font-bold"
          >
            &#9658;
          </button>
        </div>
      </div>
    </div>
    );
}