

// imports
import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 Cliente Mercado Pago usando variável de ambiente
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});
// ✅ ROTA
app.post("/criar_pagamento", async (req, res) => {
  try {
    const { nome, pacote, valor } = req.body;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            title: `Inscrição ${pacote} - ${nome}`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: Number(valor)
          }
        ],
        back_urls: {
          success: `${process.env.BASE_URL}/sucesso.html`,
          failure: `${process.env.BASE_URL}/erro.html`,
          pending: `${process.env.BASE_URL}/pendente.html`
        },
        auto_return: "approved"
      }
    });

    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});