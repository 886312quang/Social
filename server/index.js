require("dotenv").config();

const path = require("path");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const ConnectDB = require("./config/connectDB");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const event = require("events");
const configApp = require("./config/app");
const socketio = require("socket.io");
const initSockets = require("./sockets/index");
const helmet = require("helmet");
const methodOverride = require("method-override");

const app = express();

// Set max connection event listeners
event.EventEmitter.defaultMaxListeners = configApp.max_event_listeners;

// Static File
app.use("/public", express.static(path.join(__dirname, "./public")));

// Init server with socket.io & express app
const server = http.createServer(app);
const io = socketio(server, { path: "/chat/socket.io" });

//Connect to MongoDB
ConnectDB();

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use(methodOverride());

app.use(helmet());

const optionsCors = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(optionsCors));

// Config routes
app.use("/api", require("./routes/index"));
/* app.get("/", cors(optionsCors)); */

//Init all sockets
initSockets(io);

/* //use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
} */

  const port = process.env.APP_PORT || 5000;

  server.listen(port, () => {
    console.log(`Server Listening on ${port} @@`);
  });
