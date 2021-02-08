const express = require("express");
const router = express.Router();
const { authenticated } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/upload");
const { isAdmin } = require("../middlewares/cekRole");

const { register, login } = require("../controllers/registerLogin");
const { getUser, delUser } = require("../controllers/getDelUser");
const {
  getBook,
  getDetailBook,
  addBook,
  editBook,
  deleteBook,
} = require("../controllers/booksController");

router.post("/register", register);
router.post("/login", login);

router.get("/users", getUser);
router.delete("/user/:id", delUser);

router.get("/books", getBook);
router.get("/book/:id", getDetailBook);
router.post("/book", authenticated, isAdmin, uploadFile("epubFile"), addBook);
router.patch(
  "/book/:id",
  authenticated,
  isAdmin,
  uploadFile("epubFile"),
  editBook
);
router.delete("/book/:id", authenticated, isAdmin, deleteBook);

module.exports = router;
