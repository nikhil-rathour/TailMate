import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const { receiverId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [receiverInfo, setReceiverInfo] = useState(location.state || {
    receiverName: receiverId,
    receiverImage: 'https://via.placeholder.com/150',
    petId: null,
    petName: null,
    petImage: null
  });
  
  
  // Fetch receiver info if not provided in location state
  useEffect(() => {
    const fetchReceiverInfo = async () => {
      if (!location.state && currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND}/api/auth/user/${receiverId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data.success) {
            setReceiverInfo(prev => ({
              ...prev,
              receiverName: response.data.user.name,
              receiverImage: response.data.user.picture
            }));
          }
        } catch (err) {
          console.error('Error fetching receiver info:', err);
          // Keep default values if fetch fails
        }
      }
    };
    
    fetchReceiverInfo();
  }, [receiverId, currentUser, location.state]);

  // Connect to socket when component mounts
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND);
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join chat room and personal room when socket is ready
  useEffect(() => {
    if (socket && currentUser) {
      const senderId = currentUser.email.split('@')[0];
      
      // Join personal room for notifications
      socket.emit('join_personal', senderId);
      
      // Join chat room
      socket.emit('join_chat', {
        userId1: senderId,
        userId2: receiverId
      });
      // console.log(`Joined chat room for ${senderId} and ${receiverId}`);
      
      
      // Listen for incoming messages
      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
      
      // Listen for typing indicator
      socket.on('typing_indicator', ({ userId, isTyping }) => {
        if (userId === receiverId) {
          setTyping(isTyping);
        }
      });
      
      // Fetch chat history
      fetchChatHistory(senderId, receiverId);
    }
  }, [socket, currentUser, receiverId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history
  const fetchChatHistory = async (senderId, receiverId) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/chats/history/${senderId}/${receiverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !currentUser) return;
    
    try {
      const senderId = currentUser.email.split('@')[0];
      const token = await currentUser.getIdToken();
      
      const messageData = {
        senderId,
        receiverId,
        message: newMessage,
        isRead: false,
        isSent: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Emit to socket
      socket.emit('send_message', messageData);
      
      // Save to database
      await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/chats/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Clear input
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket || !currentUser) return;
    
    const senderId = currentUser.email.split('@')[0];
    
    socket.emit('typing', {
      senderId,
      receiverId,
      isTyping: true
    });
    
    // Clear typing indicator after 2 seconds
    setTimeout(() => {
      socket.emit('typing', {
        senderId,
        receiverId,
        isTyping: false
      });
    }, 2000);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentUser) {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <div className="text-gold text-2xl">Please log in to access chat</div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen text-white px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto bg-navy/50 rounded-3xl shadow-xl border border-gold/20 overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:border-gold/30">
        {/* Chat Header */}
        <div className="bg-navy p-4 flex items-center justify-between border-b border-navy/30 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="text-gold hover:text-accent-orange transition-colors duration-200 transform hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/20 shadow-md hover:border-gold/50 transition-colors duration-200">
              <img 
                src={receiverInfo.receiverImage} 
                alt={receiverInfo.receiverName} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div>
              <h2 className="font-bold text-gold">{receiverInfo.receiverName}</h2>
              {typing && (
                <p className="text-xs text-softgray flex items-center">
                  <span className="mr-1">typing</span>
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse delay-100">.</span>
                  <span className="animate-pulse delay-200">.</span>
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Pet Info (if available) */}
        {receiverInfo.petId && (
          <div className="bg-navy/70 p-3 flex items-center gap-3 border-b border-navy/30 hover:bg-navy/60 transition-colors duration-200">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold/20 shadow-md hover:border-gold/50 transition-colors duration-200">
              <img 
                src={receiverInfo.petImage || 'https://via.placeholder.com/150'} 
                alt={receiverInfo.petName} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div>
              <p className="text-sm text-softgray">Discussing about:</p>
              <p className="font-medium text-gold">{receiverInfo.petName}</p>
            </div>
          </div>
        )}
        
        {/* Messages */}
        <div className="h-[calc(100vh-300px)] md:h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-navy/30">
          {loading ? (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-2"></div>
              <p className="text-softgray">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-400">{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gold/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-softgray">No messages yet</p>
              <p className="text-xs text-softgray mt-1">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isSender = msg.senderId === currentUser.email.split('@')[0];
              const isFirstInGroup = index === 0 || messages[index - 1].senderId !== msg.senderId;
              const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId;
              
              return (
                <div 
                  key={index} 
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2' : 'mt-1'}`}
                >
                  <div 
                    className={`max-w-[75%] sm:max-w-[70%] px-4 py-2 transition-all duration-200 ${isFirstInGroup ? (isSender ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-t-2xl rounded-br-2xl') : ''} ${isLastInGroup ? (isSender ? 'rounded-b-2xl rounded-l-2xl' : 'rounded-b-2xl rounded-r-2xl') : ''} ${!isFirstInGroup && !isLastInGroup ? (isSender ? 'rounded-l-2xl' : 'rounded-r-2xl') : ''} ${isSender ? 'bg-gold text-navy hover:bg-accent-orange' : 'bg-navy/70 text-white hover:bg-navy/80'}`}
                  >
                    <p className="break-words">{msg.message}</p>
                    <div className="flex items-center justify-end mt-1 gap-1">
                      <p className={`text-xs ${isSender ? 'text-navy/70' : 'text-softgray'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                      {isSender && (
                        <span className="text-xs">
                          {msg.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div className="bg-navy/70 p-3 flex gap-2 sticky bottom-0 border-t border-navy/30">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-navy/50 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-200 placeholder-softgray/70 border border-navy/50 hover:border-gold/30"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gold hover:bg-accent-orange text-navy rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;