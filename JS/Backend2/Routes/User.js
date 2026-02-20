import express from 'express';
import { login, signup } from '../Controller/UserAuth.js';
const router = express.Router();

router.post("/user/signup",signup)
router.post("/user/login",login)

export default router;