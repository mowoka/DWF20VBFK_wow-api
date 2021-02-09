const jwt = require("jsonwebtoken");
const { User } = require("../../models");

//Dummy authenticated middleware
exports.isUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (user.role === "User") {
      next();
    } else {
      res.status(400).send({
        message: "anda bukan User",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "cek role server error",
    });
  }
};
