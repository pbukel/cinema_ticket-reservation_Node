const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const regSchema = require("../schemas/regSchema");

const { createMovies } = require("../modules/dataModule");

mongoose
  .connect(process.env.MONGO_KEY)
  .then((res) => {
    console.log("conected");
  })
  .catch((e) => {
    console.log("error");
    console.log(e);
  });

//hasshing and comparing pass functions
async function hashPass(plain) {
  const hashPass = await bcrypt.hash(plain, 10);
  return hashPass;
}
async function comparePass(pass, hashedPass) {
  const compare = bcrypt.compare(pass, hashedPass);
  return compare;
}
//User registration function
async function regUser(obj) {
  const hashedPass = await hashPass(obj.pass1);
  const item = new regSchema();
  item.email = obj.email;
  item.pass = hashedPass;
  item.age = obj.age;
  item
    .save()
    .then((result) => {
      console.log("User saved");
    })
    .catch((e) => {
      console.log(e);
    });
}

//first server RUN and create movie List
createMovies();
module.exports = {
  register: (req, res) => {
    regUser(req.body);
    res.send({ error: false, message: "registracija sekminga" });
  },
  login: async (req, res) => {
    const { email, pass } = req.body;

    const user = await regSchema.findOne({ email });
    if (!user) return res.send({ error: true, message: "no such email" });

    const compare = await comparePass(pass, user.pass);
    if (!compare) return res.send({ error: true, message: "bad pass" });

    //create user copy to send to front-end ,but avoid sending password.
    const newUser = {
      email: user.email,
      age: user.age,
      money: user.money,
    };

    res.send({
      data: newUser,
      error: false,
      message: "all OK",
    });
  },
  takeMoney: async (req, res) => {
    const { email, moneyToTake } = req.body;

    // const user = await regSchema.findOne({ email });
    const user = await regSchema.findOneAndUpdate(
      { email: email },
      { $inc: { money: Number(-moneyToTake) } },
      { new: true }
    );
    const newUser = {
      email: user.email,
      age: user.age,
      money: user.money,
    };

    res.send({
      data: newUser,
      message: "all OK",
    });
  },
};
