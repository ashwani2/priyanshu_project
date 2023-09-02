const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors=require("cors")
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const helmet=require("helmet")
const xss=require("xss-clean")
const rateLimit=require("express-rate-limit")
const hpp=require("hpp")
const mongoSanitize=require("express-mongo-sanitize");
const errorHandler = require("./middlewares/error");
const connectDB = require("./config/db");


// const logger=require("./middlewares/logger")     // my middleware logger
//load env vars
dotenv.config({
  path: "./config/config.env",
});
//connect to database
connectDB();

//Route files
const auth = require("./routes/auth");


const app = express();


//Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// app.use(logger)

app.use(fileupload());

// Sanitize data
app.use(mongoSanitize())  // to prevent us from NO-SQL injection

// Set Security headers
app.use(helmet())

//Prvent XSS attacks
app.use(xss())

// Rate Limiting
const limiter=rateLimit({
  windowMs:10 * 60 * 1000,    // 10 minutes
  max:100
})

app.use(limiter)

// prevent Hpp param pollution
app.use(hpp())

// Enable Cors
app.use(cors())

// set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount Routers
app.use("/api/v1/auth", auth);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close Server and exit process
  server.close(() => process.exit(1));
});
