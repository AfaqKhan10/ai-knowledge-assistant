import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';

const ChatInterface = () => {
  const { chatId: urlChatId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryChatId = queryParams.get('chatId');

  const initialChatId = urlChatId || queryChatId || '';

  const [chatId, setChatId] = useState(initialChatId);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      setMessages(response.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setMessages([{ role: 'assistant', content: 'Failed to load chat history.' }]);
    }
    setLoading(false);
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId, fetchMessages]);

  const createChat = async () => {
    setLoading(true);
    try {
      const response = await api.post('/chats/', { title: 'New Chat' });
      const newChatId = response.data.id;
      
      setMessages([]);
      setQuestion('');
      setChatId(newChatId);
      localStorage.setItem('lastChatId', newChatId);
    } catch (err) {
      setMessages([{ role: 'assistant', content: 'Failed to create chat: ' + (err.response?.data?.detail || 'Unknown error') }]);
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!chatId) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Please create a chat first.' }]);
      return;
    }
    if (!question.trim()) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Please type a question.' }]);
      return;
    }

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    const currentQuestion = question;
    setQuestion('');
    setLoading(true);

    // AI ka placeholder message add karo (empty se shuru)
    const aiMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await api.post(`/chats/${chatId}/ask`, { content: currentQuestion });
      const fullReply = response.data.response || '';

      // Streaming effect: ek ek character dikhao (fake streaming)
      let currentText = '';
      for (let i = 0; i < fullReply.length; i++) {
        currentText += fullReply[i];

        // eslint-disable-next-line no-loop-func
        setMessages(prev => {
          const updated = [...prev];
          updated[aiMessageIndex] = { role: 'assistant', content: currentText };
          return updated;
        });

        // Speed adjust: 25ms per character (natural typing feel)
        // 15 = tez, 40 = dheema
        await new Promise(resolve => setTimeout(resolve, 25));
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[aiMessageIndex] = { role: 'assistant', content: 'Error: ' + (err.response?.data?.detail || 'Failed to get response') };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-10">
          {chatId ? 'Your Chat' : 'Start a New Chat'}
        </h2>

        {!chatId ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <button
              onClick={createChat}
              disabled={loading}
              className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] text-2xl font-semibold transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create New Chat'}
            </button>
            <p className="mt-6 text-gray-400 text-lg">
              Start chatting with your uploaded documents
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-8 bg-gray-900/50 border border-gray-700/50 rounded-3xl mb-8 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              {messages.length === 0 ? (
                <p className="text-center text-gray-400 py-32 text-xl">
                  No messages yet. Ask something about your documents!
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-6 py-4 rounded-2xl shadow-md ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-br-none'
                          : 'bg-gray-800/80 text-gray-200 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-4 bg-gray-900/50 border border-gray-700/50 p-6 rounded-3xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about your uploaded documents..."
                className="flex-1 p-5 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 text-lg resize-none h-24"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    askQuestion();
                  }
                }}
              />
              <button
                onClick={askQuestion}
                disabled={loading || !question.trim()}
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;













// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import api from '../services/api';
// import Navbar from './Navbar';

// const ChatInterface = () => {
//   const { chatId: urlChatId } = useParams(); // URL se /chat/:chatId
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const queryChatId = queryParams.get('chatId'); // ?chatId= from dashboard resume

//   // Priority: URL param > query string > nothing (no localStorage for initial load)
//   const initialChatId = urlChatId || queryChatId || '';

//   const [chatId, setChatId] = useState(initialChatId);
//   const [messages, setMessages] = useState([]);
//   const [question, setQuestion] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const fetchMessages = useCallback(async () => {
//     if (!chatId) return;
//     setLoading(true);
//     try {
//       const response = await api.get(`/chats/${chatId}/messages`);
//       setMessages(response.data || []);
//     } catch (err) {
//       console.error('Failed to load messages:', err);
//       setMessages([{ role: 'assistant', content: 'Failed to load chat history.' }]);
//     }
//     setLoading(false);
//   }, [chatId]);

//   useEffect(() => {
//     if (chatId) {
//       fetchMessages();
//     }
//   }, [chatId, fetchMessages]);

//   const createChat = async () => {
//     setLoading(true);
//     try {
//       // Clear old state completely
//       setMessages([]);
//       setQuestion('');
//       setChatId(''); // clear current chat ID first

//       const response = await api.post('/chats/', { title: 'New Chat' });
//       const newChatId = response.data.id;

//       setChatId(newChatId);
//       localStorage.setItem('lastChatId', newChatId); // only for resume button
//     } catch (err) {
//       setMessages([{ role: 'assistant', content: 'Failed to create chat: ' + (err.response?.data?.detail || 'Unknown error') }]);
//     }
//     setLoading(false);
//   };

//   const askQuestion = async () => {
//     if (!chatId) {
//       setMessages(prev => [...prev, { role: 'assistant', content: 'Please create a chat first.' }]);
//       return;
//     }
//     if (!question.trim()) {
//       setMessages(prev => [...prev, { role: 'assistant', content: 'Please type a question.' }]);
//       return;
//     }

//     const userMsg = { role: 'user', content: question };
//     setMessages(prev => [...prev, userMsg]);
//     const currentQuestion = question;
//     setQuestion('');
//     setLoading(true);

//     try {
//       const response = await api.post(`/chats/${chatId}/ask`, { content: currentQuestion });
//       const aiMsg = { role: 'assistant', content: response.data.response };
//       setMessages(prev => [...prev, aiMsg]);
//     } catch (err) {
//       const errorMsg = { role: 'assistant', content: 'Error: ' + (err.response?.data?.detail || 'Failed to get response') };
//       setMessages(prev => [...prev, errorMsg]);
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <Navbar />
//       <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8f9fa' }}>
//         <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>
//           {chatId ? 'Your Chat' : 'Start a New Chat'}
//         </h2>

//         {!chatId ? (
//           <div style={{ textAlign: 'center', marginTop: '100px' }}>
//             <button 
//               onClick={createChat}
//               disabled={loading}
//               style={{ 
//                 padding: '15px 40px', 
//                 background: '#007bff', 
//                 color: 'white', 
//                 border: 'none', 
//                 borderRadius: '8px', 
//                 fontSize: '20px', 
//                 cursor: 'pointer',
//                 boxShadow: '0 4px 12px rgba(0,123,255,0.3)'
//               }}
//             >
//               {loading ? 'Creating...' : 'Create New Chat'}
//             </button>
//           </div>
//         ) : (
//           <>
//             <div style={{
//               height: 'calc(100vh - 220px)',
//               overflowY: 'auto',
//               padding: '15px',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               background: 'white',
//               marginBottom: '20px'
//             }}>
//               {messages.length === 0 ? (
//                 <p style={{ textAlign: 'center', color: '#777', padding: '40px 0' }}>
//                   No messages yet. Ask something!
//                 </p>
//               ) : (
//                 messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       marginBottom: '20px',
//                       display: 'flex',
//                       justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
//                     }}
//                   >
//                     <div style={{
//                       maxWidth: '75%',
//                       padding: '12px 18px',
//                       borderRadius: '12px',
//                       background: msg.role === 'user' ? '#007bff' : '#e9ecef',
//                       color: msg.role === 'user' ? 'white' : '#333',
//                       boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                       borderBottomRightRadius: msg.role === 'user' ? '0' : '12px',
//                       borderBottomLeftRadius: msg.role === 'user' ? '12px' : '0'
//                     }}>
//                       {msg.content}
//                     </div>
//                   </div>
//                 ))
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             <div style={{ display: 'flex', gap: '10px', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
//               <textarea
//                 value={question}
//                 onChange={(e) => setQuestion(e.target.value)}
//                 placeholder="Ask anything about your uploaded documents..."
//                 style={{
//                   flex: 1,
//                   height: '80px',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   border: '1px solid #ccc',
//                   resize: 'none',
//                   fontSize: '16px'
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     askQuestion();
//                   }
//                 }}
//               />
//               <button
//                 onClick={askQuestion}
//                 disabled={loading || !question.trim()}
//                 style={{
//                   padding: '12px 30px',
//                   background: loading || !question.trim() ? '#ccc' : '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
//                   fontSize: '16px',
//                   transition: 'all 0.2s'
//                 }}
//               >
//                 {loading ? 'Sending...' : 'Send'}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;