import express from "express"
import { register, login, logout, updateProfile } from "../controller/auth.js";
import upload from "../lib/multer.js";
import { isAuth } from "../middleware/isAuth.js";
const router = express.Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update",isAuth, upload.single("image"), updateProfile);

export default router;