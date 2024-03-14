const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
userRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    next(error);
  }
});
userRouter.put("/:id/cart", async (request, response, next) => {
  const { id } = request.params;
  const newCart = request.body.cart;
  console.log(newCart);
  try {
    const user = await User.findById(id);

    if (!user) {
      return response.status(404).send({ error: "User not found" });
    }

    user.cart = [];

    for (const item of newCart) {
      user.cart.push({
        product: item.id,
        quantity: item.quantity,
      });
    }
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });

    response.json(updatedUser);
  } catch (error) {
    next(error);
  }
});
module.exports = userRouter;
