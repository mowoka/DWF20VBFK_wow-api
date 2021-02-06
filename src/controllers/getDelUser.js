const { User } = require("../../models");

exports.getUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "role", "password"],
      },
    });

    if (!users) {
      return res.status(400).send({
        message: "data user tidak ada",
      });
    }

    res.send({
      status: "Success",
      message: "User Successfully Retreived",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.delUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: "User Success Deleted",
      data: {
        id,
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
