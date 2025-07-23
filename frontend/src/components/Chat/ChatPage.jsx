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
    <div className="bg-navy min-h-screen text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gold">Messages</h1>
          <Link to="/" className="text-white hover:text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-navy/50 rounded-3xl shadow-xl border-2 border-navy/20 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-softgray">Loading chats...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-softgray">No messages yet</p>
              <p className="mt-2 text-sm text-softgray">
                Start browsing pets and contact owners to begin chatting
              </p>
              <Link
                to="/"
                className="mt-4 inline-block bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold shadow-lg transition"
              >
                Browse Pets
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-navy/30">
              {chats.map((chat) => (
                <Link
                  key={chat.userId}
                  to={`/chat/${chat.userId}`}
                  state={{
                    receiverId: chat.userId,
                    receiverName: chat.userName || chat.userId,
                    receiverImage: chat.userImage || 'https://via.placeholder.com/150'
                  }}
                  className={`block p-4 hover:bg-navy/70 transition ${
                    chat.unreadCount > 0 ? 'bg-navy/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-lightgray overflow-hidden">
                      <img
                        src={chat.userImage || "https://via.placeholder.com/150"}
                        alt={chat.userName || chat.userId}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-lg">{chat.userName || chat.userId}</h4>
                        <span className="text-xs text-softgray">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-softgray truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-gold text-navy text-xs rounded-full h-6 w-6 flex items-center justify-center">
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