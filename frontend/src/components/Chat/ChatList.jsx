import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

const ChatList = () => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Connect to socket when component mounts
  useEffect(() => {
    if (!currentUser) return;
    
    const newSocket = io(import.meta.env.VITE_BACKEND);
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  // Join personal room when socket is ready
  useEffect(() => {
    if (socket && currentUser) {
      const userId = currentUser.email.split('@')[0];
      
      // Join personal room for notifications
      socket.emit('join_personal', userId);
      
      // Listen for new message notifications
      socket.on('new_message_notification', (message) => {
        if (message.receiverId === userId) {
          // Update unread count
          setUnreadCount((prev) => prev + 1);
          
          // Fetch chats again to update the list
          fetchChats();
        }
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
        
        // Calculate total unread messages
        const totalUnread = response.data.data.reduce(
          (total, chat) => total + chat.unreadCount,
          0
        );
        setUnreadCount(totalUnread);
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
    return null;
  }

  return (
    <div className="relative">
      {/* Chat Icon with Notification Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-gold transition-colors duration-200 transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-gold text-navy text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Chat Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-navy/95 rounded-xl shadow-xl z-50 border border-gold/20 overflow-hidden transition-all duration-300 transform origin-top-right animate-dropdown hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <div className="p-3 border-b border-navy/30 bg-navy/80">
            <h3 className="font-bold text-gold">Messages</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-navy/20">
            {loading ? (
              <div className="p-6 text-center flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-2"></div>
                <p className="text-softgray">Loading chats...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-400">{error}</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold/50 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-softgray">No messages yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <Link
                  key={chat.userId}
                  to={`/chat/${chat.userId}`}
                  state={{
                    receiverId: chat.userId,
                    receiverName: chat.userName || chat.userId,
                    receiverImage: chat.userImage || 'https://via.placeholder.com/150'
                  }}
                  onClick={() => setIsOpen(false)}
                  className={`block p-3 hover:bg-navy/70 transition-all duration-200 border-l-2 ${chat.unreadCount > 0 ? 'bg-navy/50 border-l-gold' : 'border-l-transparent'} hover:border-l-gold/50`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lightgray overflow-hidden border border-gold/20 shadow-md hover:border-gold/50 transition-colors duration-200">
                      <img
                        src={chat.userImage || "https://via.placeholder.com/150"}
                        alt={chat.userName || chat.userId}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0"> {/* min-width prevents flex item from overflowing */}
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gold truncate">{chat.userName || chat.userId}</h4>
                        <span className="text-xs text-softgray whitespace-nowrap ml-1">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-softgray truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-gold text-navy text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md flex-shrink-0">
                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-navy/30 text-center bg-navy/80">
            <Link
              to="/chats"
              onClick={() => setIsOpen(false)}
              className="text-gold hover:text-accent-orange text-sm font-medium transition-colors duration-200 inline-flex items-center"
            >
              See all messages
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;