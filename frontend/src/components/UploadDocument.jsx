import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import Navbar from './Navbar';

const UploadDocument = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Agar token nahi hai to login page pe redirect kar do
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Agar token nahi hai to kuch mat dikhao (redirect ho jayega)
  if (!token) {
    return null; // ya loading spinner dikha sakte ho, lekin redirect ho jayega
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const docId = response.data.id;
      setMessage('Upload successful!');
      navigate(`/chat?docId=${docId}`);
    } catch (err) {
      setMessage('Upload failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card - same dark neon theme */}
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-3xl shadow-2xl p-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Upload Your Document</h2>
            <p className="text-gray-400 text-lg mb-10">
              Add PDF or TXT files to chat with them using AI
            </p>

            {message && (
              <div className={`mb-8 p-4 rounded-xl text-center ${
                message.includes('successful') 
                  ? 'bg-green-900/30 border border-green-500/50 text-green-200' 
                  : 'bg-red-900/30 border border-red-500/50 text-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-8">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select File (PDF or TXT)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="w-full px-5 py-5 bg-gray-800/50 border border-gray-600 rounded-xl text-white file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:text-base file:font-medium file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/40 transition-all duration-300 cursor-pointer shadow-inner"
                  />
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="w-full py-5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] font-semibold text-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
























// import React, { useState } from 'react';
// import api from '../services/api';
// import Navbar from './Navbar';
// import { useNavigate } from 'react-router-dom';

// const UploadDocument = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();  // ← yeh line top pe honi chahiye

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage('Please select a file first.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await api.post('/documents/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const docId = response.data.id;  // ← yahan se docId le lo
//       setMessage('Upload successful! Document ID: ' + docId);

//       navigate(`/chat?docId=${docId}`);  // ← ab sahi chalega
//     } catch (err) {
//       setMessage('Upload failed: ' + (err.response?.data?.detail || 'Unknown error'));
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ padding: '30px', textAlign: 'center' }}>
//         <h2>Upload Your Document</h2>
//         <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
//         <br /><br />
//         <button 
//           onClick={handleUpload} 
//           style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//         >
//           Upload File
//         </button>
//         {message && <p style={{ marginTop: '20px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default UploadDocument;