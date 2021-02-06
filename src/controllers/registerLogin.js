const { User } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate({
      email: req.body.email,
      password: req.body.password,
    });

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const cekEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (cekEmail) {
      return res.status(400).send({
        message: "Email Already Register",
      });
    }

    const hassedStrength = 10;
    const hassedPassword = await bcrypt.hash(password, hassedStrength);

    const user = await User.create({
      ...req.body,
      password: hassedPassword,
      role: "User",
    });

    const secretKey = "Mokaz-Dev";
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    );

    res.send({
      status: "Success",
      message: "Register Success",
      data: {
        chanel: {
          email,
          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate({
      email: req.body.email,
      password: req.body.password,
    });

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).send({
        message: "Your Credential is not valid",
      });
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(400).send({
        message: "Your Credential is not valid",
      });
    }

    const secretKey = "Mokaz-Dev";
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    );

    res.send({
      status: "Success",
      message: "Login Success",
      data: {
        chanel: {
          email,
          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

// exports.dummy = async (req, res) => {
//   try {
//   } catch (err) {
// console.log(err);
// res.status(500).send({
//   message: "Server Error",
// });
// }
// };
