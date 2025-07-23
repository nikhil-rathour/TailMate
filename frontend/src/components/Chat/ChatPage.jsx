import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Connect to socket when component mounts
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const newSocket = io(import.meta.env.VITE_BACKEND);
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, navigate]);

  // Join personal room when socket is ready
  useEffect(() => {
    if (socket && currentUser) {
      const userId = currentUser.email.split('@')[0];
      
      // Join personal room for notifications
      socket.emit('join_personal', userId);
      
      // Listen for new message notifications
      socket.on('new_message_notification', () => {
        // Fetch chats again to update the list
        fetchChats();
      });
    }
  }, [socket, currentUser]);

  // Fetch chats when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser]);

  // Fetch chats
  const fetchChats = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const userId = currentUser.email.split('@')[0];
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/chats/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setChats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!currentUser) {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <div className="text-gold text-2xl">Please log in to access chats</div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen text-white px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Messages
          </h1>
          <Link to="/" className="text-white hover:text-gold transition-colors duration-200 transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-navy/50 rounded-3xl shadow-xl border border-gold/20 overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:border-gold/30">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-3"></div>
              <p className="text-softgray">Loading chats...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          ) : chats.length === 0 ? (
            <div className="p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gold/50 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-softgray text-lg mb-2">No messages yet</p>
              <p className="text-sm text-softgray mb-6">
                Start browsing pets and contact owners to begin chatting
              </p>
              <Link
                to="/"
                className="inline-flex items-center bg-gold hover:bg-accent-orange text-navy px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Browse Pets
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-navy/30">
              {chats.map((chat, index) => (
                <Link
                  key={chat.userId}
                  to={`/chat/${chat.userId}`}
                  state={{
                    receiverId: chat.userId,
                    receiverName: chat.userName || chat.userId,
                    receiverImage: chat.userImage || 'https://via.placeholder.com/150'
                  }}
                  className={`block p-4 hover:bg-navy/70 transition-all duration-200 ${index === 0 ? 'border-l-4 border-l-gold' : 'border-l-4 border-l-transparent hover:border-l-gold/50'} ${chat.unreadCount > 0 ? 'bg-navy/50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-lightgray overflow-hidden border-2 border-navy/50 shadow-md hover:border-gold/50 transition-colors duration-200">
                      <img
                        src={chat.userImage || "https://via.placeholder.com/150"}
                        alt={chat.userName || chat.userId}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0"> {/* min-width prevents flex item from overflowing */}
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-lg text-gold truncate">{chat.userName || chat.userId}</h4>
                        <span className="text-xs text-softgray whitespace-nowrap ml-2">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-softgray truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-gold text-navy text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-pulse">
                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;