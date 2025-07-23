const http = require("http")
const app = require("./app")
require("dotenv").config()
const port = process.env.PORT || 4000
const { initializeSocket } = require("./socket")

const server = http.createServer(app)

// Initialize Socket.io
const io = initializeSocket(server);

// Export io for use in other files
module.exports = { io };

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});