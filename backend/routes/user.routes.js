import express from "express";
import { checkAuth, getUserInfo } from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getUserInfo);
router.get("/checkAuth", isAuth, checkAuth)

export default router;
