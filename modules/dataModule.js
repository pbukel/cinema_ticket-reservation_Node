const movies = require("../movies.json");

const moveArr = [];

module.exports = {
  getMovies: () => {
    return moveArr;
  },
  createMovies: () => {
    //original list is too big, so little slicing it
    const arr = movies.slice(0, 8);

    moveArr.push(...arr);
    for (const x of moveArr) {
      x.seats = [];
      for (let i = 1; i < 50; i++) {
        x.seats.push({
          id: null,
          seatNumber: i,
          selected: false,
          whoSelected: null,
          reservation: false,
          email: null,
          price: 7.99,
        });
      }
    }
    // console.log(moveArr);
  },
  getSingleMovie: (index) => {
    return moveArr[index];
  },
  setSelectedSeat: (moveIndex, seatIndex, socketID) => {
    moveArr[moveIndex].seats[seatIndex].selected =
      !moveArr[moveIndex].seats[seatIndex].selected;
    if (moveArr[moveIndex].seats[seatIndex].selected) {
      moveArr[moveIndex].seats[seatIndex].whoSelected = socketID;
    } else {
      moveArr[moveIndex].seats[seatIndex].whoSelected = null;
    }
  },
  mySelected: (moveIndex, socketID) => {
    const mySelectedSeats = moveArr[moveIndex].seats.filter(
      (x) => x.whoSelected === socketID
    );
    return mySelectedSeats;
  },
  buyTikets: (moveIndex, socketID, email) => {
    const mySelectedSeats = moveArr[moveIndex].seats.filter(
      (x) => x.whoSelected === socketID
    );
    mySelectedSeats.map((x) => {
      x.whoSelected = null;
      x.selected = false;
      x.reservation = true;
      x.email = email;
    });
  },
};
