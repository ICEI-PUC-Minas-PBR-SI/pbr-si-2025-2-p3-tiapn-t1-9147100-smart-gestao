// Rotas de autenticação

import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Registrar novo usuário
router.post("/register", register);

// Login de usuário
router.post("/login", login);

export default router;
