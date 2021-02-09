const express = require("express");
const router = express.Router();
const { authenticated } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/upload");
const { uploadFileImage } = require("../middlewares/uploadImage");
const { isAdmin } = require("../middlewares/cekRole");
const { isUser } = require("../middlewares/cekRoleUser");

const { register, login } = require("../controllers/registerLogin");
const { getUser, delUser } = require("../controllers/getDelUser");
const {
  getBook,
  getDetailBook,
  addBook,
  editBook,
  deleteBook,
} = require("../controllers/booksController");

const {
  addTransaction,
  editTransaction,
  getTransaction,
  getTransactions,
} = require("../controllers/TransactionController");

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

router.get("/transactions", getTransactions);
router.get("/transaction/:id", getTransaction);
router.post(
  "/transaction",
  authenticated,
  isUser,
  uploadFileImage("imageFile"),
  addTransaction
);
router.patch("/transaction/:id", authenticated, isAdmin, editTransaction);

module.exports = router;
