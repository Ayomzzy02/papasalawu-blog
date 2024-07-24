const Article = require('../models/Article')
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllArticles = catchAsync(async function (req, res, next) {
  // Fetch all published articles, sorted by category, and populate the author's information
  const articles = await Article.find({ status: 'Published' }).sort({ category: 1 }).populate('author');

  return res.status(200).json({
    status: 'success',
    data: {
      articles,
    },
  });
});


exports.createArticle = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    //Proceed to Save Article
    const newArticle = new Article({
      author: userId,
      title: req.body.title,
      contentText: req.body.contentText,
      category: req.body.category,
      keywords: req.body.keywords,
  });

  const savedArticle = await newArticle.save();

    if (!savedArticle) {
      return next(new AppError("Invalid Article Data", 400));
    }

    return res.status(201).json({
      status: "success",
      data: {
        message: "Article Successfully Created",
        listing: savedArticle,
      },
    });
  } catch (error) {
    return next(
      new AppError(`An unexpected server error occurred ${error}`, 500)
    );
  }
});

exports.deleteArticle = catchAsync(async function (req, res, next) {
  try {
    const { articleId } = req.params;

    await Article.findByIdAndDelete(articleId);

    res.status(200).send("Article Deleted successfully");
  } catch (error) {
    return next(new AppError("An unexpected server error occurred", 500));
  }
});


exports.updateArticle = catchAsync(async function (req, res, next) {
  try {
    const { articleId } = req.params;

    //update Host User Listing
    const updateArticle = await Article.findByIdAndUpdate(articleId, req.body);

    if (updateArticle) {
      return res.status(200).json({
        status: "success",
        data: {
          message: "Article Updated Successfully.",
        },
      });
    }

    return res.status(404).json({
      status: "Error",
      message: "Unable to Update Article Data",
    });
  } catch (error) {
    return next(
      new AppError(`An unexpected server error occurred ${error}`, 500)
    );
  }
});
