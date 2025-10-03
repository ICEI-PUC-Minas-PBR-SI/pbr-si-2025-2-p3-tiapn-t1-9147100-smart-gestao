// Rotas de clientes

import express from "express";
import { createClient, getClient } from "../controllers/clientController.js";

const router = express.Router();

// Criar cliente
router.post("/", createClient);

// Obter cliente por ID
router.get("/:id", getClient);

export default router;
