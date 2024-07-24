require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const articleRoute = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes"); //User Authentication routes
const globalErrorMiddleware = require("./controllers/errorControllers");

/* Configuring CORS, This allows Backend server to accept request only from specified internal endpoint or thirdparty
any endpoint not including here will be blocked my CORS*/
const corsOptions = {
    origin: ["frontend.com", "apiserver2.com"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  };

// Enabling CORS Pre-Flight
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));


// - Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// This is the index route to the Backend Server Endpoint
app.get("/test", (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome to TechCorp API. 🎯",
  });
});


app.use(`${process.env.API_BASE_URL}/article`, articleRoute);
app.use(`${process.env.API_BASE_URL}/auth`, authRoutes);

// Any request that makes it to this part has lost it's way
app.all("*", (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server! Go to  /v1/techcorp`,
    404
  );
  next(error);
});

// Global Error Handling middleware
app.use(globalErrorMiddleware);

module.exports = app;