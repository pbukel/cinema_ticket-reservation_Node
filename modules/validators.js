const validator = require("email-validator");

module.exports = {
  validateRegistration: (req, res, next) => {
    const { email, pass1, pass2, age } = req.body;
    let validationError = 0;
    if (!validator.validate(email)) validationError = "Bad email!";
    if (pass1 !== pass2 || pass1 === "" || pass2 === "")
      validationError = "pass do not match";
    if (!age || age <= 0 || age === NaN || age > 99)
      validationError = "bad age data";

    // aditional PASSWORD validations:
    // let hasUpper = false;
    // let hasNumber = false;

    // let pasnoNnumber = "";

    // for (let i = 0; i < password.length; i++) {
    //   if (!Number(password[i])) pasnoNnumber += password[i];

    //   if (Number(password[i]) || Number(password[i] === 0)) hasNumber = true;
    // }
    // for (let i = 0; i < pasnoNnumber.length; i++) {
    //   if (pasnoNnumber[i] === pasnoNnumber[i].toUpperCase()) hasUpper = true;
    // }

    // if (!hasUpper) validationError = "pass need to have Upper";
    // if (!hasNumber) validationError = "pass need to have number";

    if (validationError)
      return res.send({ error: true, message: validationError });

    next();
  },
};
