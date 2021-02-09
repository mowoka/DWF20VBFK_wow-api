const { Book } = require("../../models");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");

exports.getBook = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Successs",
      message: "Books Successfully Retreived ",
      data: {
        books,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.addBook = async (req, res) => {
  try {
    // validatasi untuk input buku
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      publicationDate: Joi.string().min(5).required(),
      pages: Joi.number().integer().min(2).required(),
      author: Joi.string().min(3).required(),
      isbn: Joi.number().integer().min(5).required(),
      about: Joi.string().min(10).required(),
      bookFile: Joi.string().min(8).required(),
    });

    const { error } = schema.validate({
      title: req.body.title,
      publicationDate: req.body.publicationDate,
      pages: req.body.pages,
      author: req.body.author,
      isbn: req.body.isbn,
      about: req.body.about,
      bookFile: req.files.epubFile[0].filename,
    });

    if (error) {
      const fileName = req.files.epubFile[0].filename;
      const locals = path.join(__dirname, "..", "..", "uploads");
      const filePath = path.join(locals, fileName);
      fs.unlinkSync(filePath);

      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const cekBook = await Book.findOne({
      where: {
        title: req.body.title,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (cekBook) {
      const fileName = req.files.epubFile[0].filename;
      const locals = path.join(__dirname, "..", "..", "uploads");
      const filePath = path.join(locals, fileName);
      fs.unlinkSync(filePath);

      return res.send({
        status: "Warning",
        message: "Your Book already exist",
        data: {
          book: cekBook,
        },
      });
    }

    const book = await Book.create({
      title: req.body.title,
      publicationDate: req.body.publicationDate,
      pages: req.body.pages,
      author: req.body.author,
      isbn: req.body.isbn,
      about: req.body.about,
      bookFile: req.files.epubFile[0].filename,
    });

    res.send({
      status: "Success",
      message: "Book Successfully added",
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.getDetailBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!book) {
      return res.send({
        status: "Success",
        message: `Book with id ${id} Not Found`,
      });
    }

    res.send({
      status: "Success",
      message: `Book with id ${id} Successfully Retreived`,
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.editBook = async (req, res) => {
  try {
    const { id } = req.params;

    const findBook = await Book.findOne({
      where: {
        id,
      },
    });

    if (!findBook) {
      return res.send({
        status: "Success",
        message: `Book with id ${id} Not Found`,
      });
    }

    await Book.update(req.body, {
      where: {
        id,
      },
    });

    const book = await Book.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      message: `Book with id ${id} Successfully Update`,
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    await Book.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: `Book with id ${id} Successfully Delete`,
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
