// src/pages/api/gemini.js

import axios from "axios";
import { API_KEY } from "@env";
import { delay } from "./utils";

export const gemini = async (message, retries = 3) => {
  while (retries > 0) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Você é um assistente 
                  
                  : ${message}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Log da resposta da API para depuração
      console.log("Resposta da API:", JSON.stringify(response.data, null, 2));

      // Verifica se há candidatos e se o conteúdo está presente
      if (response.data.candidates && response.data.candidates.length > 0) {
        const parts = response.data.candidates[0].content.parts;
        if (parts && parts.length > 0) {
          return parts[0].text.trim(); // Acessa o texto corretamente
        } else {
          throw new Error("Conteúdo não encontrado.");
        }
      } else {
        throw new Error("Resposta inválida da API.");
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        retries--;
        const waitTime = 2000 * (3 - retries);
        console.warn(
          `Limite de requisições excedido. Tentando novamente em ${
            waitTime / 1000
          } segundos...`
        );
        await delay(waitTime);
      } else if (error.response && error.response.status === 403) {
        console.error(
          "Cota insuficiente. Verifique seu plano e detalhes de faturamento."
        );
        return "Cota insuficiente. Verifique seu plano e detalhes de faturamento.";
      } else {
        console.error(
          "Erro ao processar a mensagem: ",
          error.response ? error.response.data : error.message
        );
        throw new Error("Erro ao processar a mensagem ou problema de limite.");
      }
    }
  }

  return "Limite de tentativas atingido. Por favor, tente novamente mais tarde.";
};
