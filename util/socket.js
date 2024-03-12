import io from "socket.io-client";

console.log("creating socket connection");
const socket = io("", {
  reconnection: true,
});

export default socket;
