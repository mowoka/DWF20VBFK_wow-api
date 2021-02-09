const { Transaction, User } = require("../../models");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");

exports.addTransaction = async (req, res) => {
  try {
    // validatasi untuk input Transcation
    const schema = Joi.object({
      userId: Joi.number().integer().min(1).required(),
      transferProof: Joi.string().min(3).required(),
    });

    const { error } = schema.validate({
      userId: req.user.id,
      transferProof: req.files.imageFile[0].filename,
    });

    if (error) {
      const fileName = req.files.imageFile[0].filename;
      const locals = path.join(__dirname, "..", "..", "uploads");
      const filePath = path.join(locals, fileName);
      fs.unlinkSync(filePath);

      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      transferProof: req.files.imageFile[0].filename,
      remainingActive: 30,
      userStatus: "Active",
      paymentStatus: "Pending",
    });

    res.send({
      status: "Success",
      message: "Transaction Successfully added",
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const findTransaction = await Transaction.findOne({
      where: {
        id,
      },
    });

    if (!findTransaction) {
      return res.send({
        status: "Success",
        message: `Book with id ${id} Not Found`,
      });
    }

    await Transaction.update(req.body, {
      where: {
        id,
      },
    });

    const transaction = await Transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      message: `Transcation with id ${id} Successfully Update`,
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "role", "email"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!transaction) {
      return res.send({
        status: "Success",
        message: `transaction with id ${id} Not Found`,
      });
    }

    res.send({
      status: "Success",
      message: `transaction with id ${id} Successfully Retreived`,
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "role", "email"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });
    res.send({
      status: "Successs",
      message: "Transactions Successfully Retreived ",
      data: {
        transactions,
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
