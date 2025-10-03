// Controlador de clientes: criação e consulta

import Client from "../models/Client.js";

// Cria um novo cliente (empresa/MEI)
export const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retorna um cliente pelo ID
export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
