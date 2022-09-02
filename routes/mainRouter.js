const express = require("express");
const router = express.Router();

const { register, login, takeMoney } = require("../controllers/mainCOntroller");
const { validateRegistration } = require("../modules/validators");

router.post("/register", validateRegistration, register);
router.post("/login", login);
router.post("/moneyToTake", takeMoney);

module.exports = router;
