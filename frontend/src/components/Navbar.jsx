import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';  // ← useLocation add karo
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();  // ← current path jaanne ke liye

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          AI Assistant
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-8 md:space-x-12">
          <Link
            to="/"
            className={`text-gray-300 hover:text-cyan-400 transition duration-300 text-base md:text-lg font-medium relative ${
              isActive('/') ? 'text-cyan-400 after:content-[""] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[3px] after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:rounded-full' : ''
            }`}
          >
            Home
          </Link>

          {token ? (
            <>
              <Link
                to="/dashboard"
                className={`text-gray-300 hover:text-cyan-400 transition duration-300 text-base md:text-lg font-medium relative ${
                  isActive('/dashboard') ? 'text-cyan-400 after:content-[""] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[3px] after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:rounded-full' : ''
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/upload"
                className={`text-gray-300 hover:text-cyan-400 transition duration-300 text-base md:text-lg font-medium relative ${
                  isActive('/upload') ? 'text-cyan-400 after:content-[""] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[3px] after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:rounded-full' : ''
                }`}
              >
                Upload
              </Link>

              <Link
                to="/chat"
                className={`text-gray-300 hover:text-cyan-400 transition duration-300 text-base md:text-lg font-medium relative ${
                  isActive('/chat') || location.pathname.startsWith('/chat/') ? 'text-cyan-400 after:content-[""] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[3px] after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:rounded-full' : ''
                }`}
              >
                Chat
              </Link>

              <button
                onClick={logout}
                className="text-gray-300 hover:text-red-400 transition duration-300 text-base md:text-lg font-medium bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-gray-300 hover:text-cyan-400 transition duration-300 text-base md:text-lg font-medium relative ${
                  isActive('/login') ? 'text-cyan-400 after:content-[""] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[3px] after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:rounded-full' : ''
                }`}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={`text-gray-300 hover:text-cyan-400 transition duration-300 text-base md:text-lg font-medium relative ${
                  isActive('/signup') ? 'text-cyan-400 after:content-[""] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[3px] after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:rounded-full' : ''
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

















// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';

// const Navbar = () => {
//   const { token, logout } = useContext(AuthContext);

//   return (
//     <nav style={{ background: '#008e8c', padding: '10px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//       <div>
//         <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Home</Link>
//         {token && (
//           <>
//             <Link to="/dashboard" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Dashboard</Link>
//             <Link to="/upload" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Upload Document</Link>
//           </>
//         )}
//       </div>
//       <div>
//         {token ? (
//           <button 
//             onClick={logout} 
//             style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
//           >
//             Logout
//           </button>
//         ) : (
//           <>
//             <Link to="/login" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
//             <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;