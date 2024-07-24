const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth"); //Authentication Middleware

const {
    getAllArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticle
} = require("../controllers/articleControllers");

router.route("/getAllArticles").get(getAllArticles); //Route for fetching All Articles 
router.route("/getArticles/:articleId").get(getAllArticles); //Route for fetching Specific Articles 

//Authentication middleware: Routes below here are protected route and will require authentication
router.use(authenticate);

router.post(
  "/create",
  createArticle
);

router.patch(
  "/update/:articleId",
  updateArticle
);

router.delete(
  "/delete/:articleId",
  deleteArticle
);

module.exports = router;