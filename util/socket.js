import io from "socket.io-client";

console.log("creating socket connection");
const socket = io("https://sockets-48f4f0779b20.herokuapp.com", {
  reconnection: true,
});

export default socket;
