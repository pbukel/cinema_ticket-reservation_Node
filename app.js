const express = require("express");

require("dotenv").config();
const cors = require("cors");
const mainRouter = require("./routes/mainRouter");
const session = require("express-session");
const app = express();
const http = require("http").createServer(app);
const socket = require("socket.io");
const {
  getSingleMovie,
  getMovies,
  setSelectedSeat,
  mySelected,
  buyTikets,
} = require("./modules/dataModule");

const io = socket(http, { cors: { origin: "http://localhost:3000" } });

let users = [];

io.on("connect", (socket) => {
  socket.on("login", (data) => {
    const newUser = {
      id: socket.id,
      email: data.email,
      age: data.age,
      money: data.money,
    };

    users.push(newUser);
  });

  socket.on("askforMovies", () => {
    socket.emit("getMovies", getMovies());
  });
  socket.on("getSingleMovieData", (data) => {
    const info = {
      index: data,
      data: getSingleMovie(data),
    };
    socket.emit("updateMovieData", info);
  });
  socket.on("setSelected", (data) => {
    setSelectedSeat(data.movie, data.seat, socket.id);
    const info = {
      index: data.movie,
      data: getSingleMovie(data.movie),
    };
    io.emit("updateMovieData", info);

    io.to(socket.id).emit("mylSectedSeats", mySelected(data.movie, socket.id));
  });

  socket.on("buyTikets", (data) => {
    buyTikets(data.index, socket.id, data.email);
    const info = {
      index: data.index,
      data: getSingleMovie(data.index),
    };
    io.emit("updateMovieData", info);
    io.emit("getMovies", getMovies());
  });
});

http.listen(4000);
app.use(cors({ origin: true, credentials: true, methods: "GET, POST" }));

app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
  })
);

//express.json visada virs mainRouter
app.use(express.json());
app.use("/", mainRouter);
