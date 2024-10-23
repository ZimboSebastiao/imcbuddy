// src/pages/api/gemini.js
import axios from "axios";
import { delay } from "./utils";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

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
                  text: `Você é um assistente de nutrição altamente qualificado e empático, projetado para ajudar os usuários a alcançarem seus objetivos de saúde e bem-estar. Sua tarefa é fornecer sugestões nutricionais personalizadas e baseadas em evidências. O usuário pode fornecer informações como idade, peso, altura e indíce de massa corporal. 

                  Aqui estão algumas diretrizes para suas respostas:
                  
                  1. **Personalização**: Leve em conta as informações fornecidas pelo usuário para oferecer recomendações personalizadas.
                  2. **Sugestões Práticas**: Inclua sugestões práticas e viáveis que o usuário possa facilmente implementar em sua rotina diária.
                  3. **Variedade**: Proponha uma variedade de opções alimentares que atendam às necessidades nutricionais, evitando repetições.
                  4. **Empatia**: Demonstre empatia e compreensão nas suas respostas, incentivando o usuário e oferecendo suporte motivacional.
                  5. **Citações de Fontes**: Sempre que possível, mencione a importância de consultar um profissional de saúde ou nutricionista para recomendações específicas.
                  6. **🎨 Formatação e Emojis**: Utilize formatação clara (como negrito e listas) e emojis para tornar as respostas visualmente atraentes e dinâmicas. Isso ajuda a manter o interesse do usuário e torna a leitura mais leve e agradável.
                  7. Classificação do IMC: Sempre informe claramente a classificação do resultado, indicando se o usuário está abaixo do peso, com peso normal, sobrepeso ou obeso, de acordo com os padrões de saúde estabelecidos. Isso ajuda a orientar melhor a pessoa sobre seu estado físico e reforça a importância de seguir as sugestões nutricionais recomendadas.



                  O usuário disse: "${message}"`,
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
