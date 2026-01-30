import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full">
          <h2 className="text-4xl font-bold mb-8 text-white">Please login to access your dashboard</h2>
          <Link to="/login">
            <button className="w-full py-5 px-10 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)]">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const lastChatId = localStorage.getItem('lastChatId');

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
          Your Dashboard
        </h1>
        <p className="text-center text-xl text-gray-400 mb-16">
          Logged in • Ready to explore documents & chats
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Link to="/upload">
            <div className="group relative bg-gray-900/50 border border-cyan-500/30 p-10 rounded-3xl overflow-hidden hover:border-cyan-400 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-3xl font-bold mb-4 text-cyan-300">Upload Document</h3>
              <p className="text-gray-300 text-lg">Add your files to start chatting</p>
            </div>
          </Link>

          <Link to="/chat">
            <div className="group relative bg-gray-900/50 border border-blue-500/30 p-10 rounded-3xl overflow-hidden hover:border-blue-400 transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-3xl font-bold mb-4 text-blue-300">New Chat</h3>
              <p className="text-gray-300 text-lg">Talk to your documents</p>
            </div>
          </Link>
        </div>

        {lastChatId && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-cyan-300 mb-8">Resume Last Session</h2>
            <Link to={`/chat?chatId=${lastChatId}`}>
              <button className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] text-xl font-semibold">
                Continue Chat
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;