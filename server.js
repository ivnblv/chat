const express = require("express");
const socket = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("client/dist"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

const server = app.listen(PORT);
const io = (module.exports.io = socket(server));
io.on("connection", require("./socketEvents"));
