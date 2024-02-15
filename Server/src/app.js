import express, { json } from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import authRoutes from "./routes/user.js";
import pinRoutes from "./routes/pin.js"
import searchRoutes from "./routes/search.js"
import commentRoutes from "./routes/comment.js"

const app = express();
app.use(morgan("dev"));
app.use(json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Hello mogoose");
});

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/pin", pinRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/comment", commentRoutes);


//no route error
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//general and specific error
app.use((error, req, res) => {
  console.log(error);
  let errorMessage = "An unknown error has occrred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.statusCode;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
