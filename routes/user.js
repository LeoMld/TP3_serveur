const app = require("../app");
const express = require("express");
const router = express.Router();

router.get("/:id/paris", function (req, res, next) {
  const users = app.getUsers();
  for (const user of users) {
    if (user.userId === req.params.id) {
      res.status(200);
      res.json(user.bets);
      return;
    }
  }
  res.status(404);
  res.json({ msg: "Id not found" });
});

module.exports = router;
