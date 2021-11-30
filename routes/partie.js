const express = require("express");
const router = express.Router();

const gen = require("../Generateur");

/* GET parties listing. */
router.get("/", function (req, res, next) {
  res.send(gen.liste_partie);
});

router.get("/:id", function (req, res, next) {
  id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(403);
    res.send("Bad request");
  }
  if (id >= gen.liste_partie.length || id < 0) {
    res.status(403);
    res.send("This is does not exists");
  }
  res.send(gen.liste_partie[req.params.id]);
});

router.post("/:id/parier", function (req, res) {
  id = parseInt(req.params.id);
  if (isNaN(id) || id >= gen.liste_partie.length || id < 0) {
    res.status(403);
    res.json({ msg: "This id does not exists" });
  }
  /*
  if (gen.liste_partie[id].pointage.manches !== [0, 0]) {
    res.status(401);
    res.json({ msg: "Can't bet after the first set" });
  }
  */
  const { amount, userId, player } = { ...req.body };
  if (!(amount && userId && player)) {
    res.status(403);
    res.json({ err: "Bad body type" });
  }
  numberAmount = parseInt(amount);
  if (
    isNaN(numberAmount) ||
    numberAmount < 0 ||
    !(player === 1 || player === 2)
  ) {
    res.status(403);
    res.json({ err: "Forbidden values" });
  }
  const bet = gen.liste_partie[id].parier(userId, numberAmount, player);
  res.json(bet);
});

module.exports = router;
