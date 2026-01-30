import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-4 relative z-10 w-full">

        {/* Hero Section */}
        <div className="text-center mb-10 w-full pt-6">

          {/* SAFE TEXT WRAPPER */}
          <div className="py-4 overflow-visible">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.35]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] inline-block pb-3">
                  AI Knowledge Assistant
                </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-cyan-50/60 max-w-2xl mx-auto leading-relaxed font-medium mt-2">
            Upload your documents, chat with them using powerful AI, and get instant answers from your own knowledge base.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <Link to="/signup">
            <button className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]">
              Sign Up Free
            </button>
          </Link>

          <Link to="/login">
            <button className="px-10 py-4 bg-white/5 border border-white/10 text-cyan-300 rounded-2xl font-bold text-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              Login
            </button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Feature 1 */}
          <div className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.06] hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-1">
            <div className="text-5xl mb-5 bg-cyan-500/10 w-fit p-4 rounded-2xl text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all">
              📄
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Upload Documents</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              PDF, TXT or any text-based files – instantly ready for AI chat.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.06] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1">
            <div className="text-5xl mb-5 bg-blue-500/10 w-fit p-4 rounded-2xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all">
              💬
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Smart Chat</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Ask anything about your documents – get accurate, context-aware answers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.06] hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] hover:-translate-y-1">
            <div className="text-5xl mb-5 bg-indigo-500/10 w-fit p-4 rounded-2xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all">
              🔒
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your documents stay yours – no data shared with third parties.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
