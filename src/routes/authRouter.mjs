import { Router } from "express";
import { signin, signup } from "../controllers/authController.mjs";
import {checkDuplicateEmail, checkDuplicateUsername} from "../middlewares/verify.mjs";

const router = new Router()

router.post('/signup', checkDuplicateUsername, checkDuplicateEmail, signup)
router.post('/signin', signin)

export default router