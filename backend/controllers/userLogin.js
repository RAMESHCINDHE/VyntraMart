const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user.js");
loginRouter.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);
    if (!user || !passwordCorrect) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    response.status(200).send(user);
  } catch (error) {
    next(error);
  }
});
loginRouter.post("/signup", async (request, response, next) => {
  try {
    const body = request.body;
    if (!body.username || !body.password) {
      response
        .status(400)
        .json({ error: "username or password is not provided" });
      return;
    }
    if (body.username.length < 3 || body.password.length < 3) {
      response
        .status(400)
        .json({ error: "username or password length must be 3 atleast" });
      return;
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash,
    });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});
module.exports = loginRouter;
