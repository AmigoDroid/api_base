import { Router } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
//import modules
import { user } from "./router_user.js";
import notFound from "../Middleware/notFound.js";
import errorHandler from "../Middleware/errorHandler.js";
import mediaRoutes from "./mediaRoutes.js";
//constants
const router = Router();
//use modules
router.use(morgan("dev"));
router.use(cors());
router.use(bodyParser.json());
//routes
router.use("/user", user)
router.use("/media",mediaRoutes)
//not found middleware
router.use(notFound);
//error handler middleware
router.use(errorHandler);

export { router };