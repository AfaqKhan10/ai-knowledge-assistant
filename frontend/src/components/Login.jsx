import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';  // ← yeh icons install karne hain

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;  // ← yahan user aa raha hai
    
    login(access_token);
    
    // User name save kar do localStorage mein (Navbar use karega)
    localStorage.setItem('userName', user.name || 'User');
    
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.detail || 'Login failed. Check email/password.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-3xl shadow-2xl p-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-lg mb-10">
            Log in to continue chatting with your documents
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-5 py-4 rounded-xl mb-8 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 text-lg shadow-inner disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 text-lg shadow-inner disabled:opacity-50 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-cyan-400 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] font-semibold text-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400/50 flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-lg">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition duration-200">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

















// import React, { useState, useContext } from 'react';
// import AuthContext from '../context/AuthContext';
// import api from '../services/api';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await api.post('/auth/login', { email, password });
//       const { access_token } = response.data;
//       login(access_token);  // token save + dashboard pe redirect
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Login failed. Check email/password.');
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>
//         <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
//           Login
//         </button>
//       </form>
//       <p style={{ marginTop: '15px', textAlign: 'center' }}>
//         Don't have an account? <Link to="/signup">Sign Up</Link>
//       </p>
//     </div>
//   );
// };

// export default Login;