const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth"); //Authentication Middleware

const {
    getAllArticles,
    createArticle,
    updateArticle,
    deleteArticle
} = require("../controllers/articleControllers");


//Route for fetching All Articles 
router.route("/getAllArticles").get(getAllArticles);

//Authentication middleware: Routes below here are protected route and will require authentication
router.use(authenticate);

router.post(
  "/create",
  createArticle
);

router.patch(
  "/update",
  updateArticle
);

router.delete(
  "/delete",
  deleteArticle
);

module.exports = router;