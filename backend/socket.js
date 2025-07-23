const socketIo = require("socket.io");

// Initialize Socket.io
const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // Join a chat room (userId1_userId2 format, sorted alphabetically)
    socket.on("join_chat", ({ userId1, userId2 }) => {
      const roomId = [userId1, userId2].sort().join("_");
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });
    
    // Send a message
    socket.on("send_message", (messageData) => {
      const { senderId, receiverId } = messageData;
      const roomId = [senderId, receiverId].sort().join("_");
      
      // Broadcast to the room
      io.to(roomId).emit("receive_message", messageData);
      
      // Also emit to the receiver's personal room for notifications
      io.to(receiverId).emit("new_message_notification", messageData);
    });
    
    // Join personal room for notifications
    socket.on("join_personal", (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined personal room: ${userId}`);
    });
    
    // Handle typing indicator
    socket.on("typing", ({ senderId, receiverId, isTyping }) => {
      const roomId = [senderId, receiverId].sort().join("_");
      socket.to(roomId).emit("typing_indicator", { userId: senderId, isTyping });
    });
    
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };