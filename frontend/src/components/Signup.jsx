import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [firstName, setFirstName] = useState('');  // ← New state for First Name
  const [lastName, setLastName] = useState('');   // ← New state for Last Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Combine firstName aur lastName into full name
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      await api.post('/auth/signup', { name: fullName, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-3xl shadow-2xl p-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-gray-400 text-lg mb-10">
            Join now and chat with your documents
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-5 py-4 rounded-xl mb-8 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name – do boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 text-lg shadow-inner disabled:opacity-50"
                  placeholder="First Name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 text-lg shadow-inner disabled:opacity-50"
                  placeholder="Last Name"
                />
              </div>
            </div>

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
                'Sign Up'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-lg">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition duration-200">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;












// import React, { useState } from 'react';
// import api from '../services/api';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();  // ← yeh line yahan sahi jagah pe

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       await api.post('/auth/signup', { name, email, password });
//       navigate('/login');  // Signup success → login pe redirect
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Signup failed. Try again.');
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2>Sign Up</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>
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
//         <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
//           Sign Up
//         </button>
//       </form>
//       <p style={{ marginTop: '15px', textAlign: 'center' }}>
//         Already have an account? <a href="/login">Login</a>
//       </p>
//     </div>
//   );
// };

// export default Signup;