import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import UploadDocument from './components/UploadDocument';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/chat/:chatId" element={<ChatInterface />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;







// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './pages/Dashboard';
// import Home from './pages/Home';
// import NotFound from './pages/NotFound';
// import UploadDocument from './components/UploadDocument';
// import ChatInterface from './components/ChatInterface';

// function App() {
//   return (
//     <Router>  {/* Router sab se bahar */}
//       <AuthProvider>  {/* AuthProvider Router ke andar */}
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/upload" element={<UploadDocument />} />
//           <Route path="/chat" element={<ChatInterface />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;