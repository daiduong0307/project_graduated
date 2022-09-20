const app = require("./app");
const port = 3000;

const http = require("http");
const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
