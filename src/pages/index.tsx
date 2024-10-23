import Image from "next/image";
import localFont from "next/font/local";
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState<number | null>(null);

  // Função para calcular o IMC
  const calcularIMC = () => {
    const alturaMetros = parseFloat(altura);
    const pesoKg = parseFloat(peso);

    if (alturaMetros > 0 && pesoKg > 0) {
      const imcCalculado = pesoKg / (alturaMetros * alturaMetros);
      setImc(parseFloat(imcCalculado.toFixed(2)));
    }
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Calculadora de IMC </h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* Inputs de peso e altura */}
          <div className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Peso (kg)"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Altura (m)"
              value={altura}
              onChange={(e) => {
                let valor = e.target.value;
                valor = valor.replace(/[^0-9.]/g, "");
                if (valor.split(".").length > 2) {
                  return;
                }
                if (valor.length === 2 && !valor.includes(".")) {
                  valor = valor[0] + "." + valor[1];
                }
                const [parteInteira, parteDecimal] = valor.split(".");

                if (parteDecimal && parteDecimal.length > 2) {
                  return;
                }
                setAltura(valor);
              }}
              className="border p-2 rounded"
            />

            <button
              onClick={calcularIMC}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Calcular IMC
            </button>
          </div>
        </div>

        {/* Exibir o resultado do IMC */}
        {imc !== null && (
          <div className="mt-4">
            <p>
              Seu IMC é: <strong>{imc}</strong>
            </p>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/ZimboSebastiao"
          target="_blank"
          rel="meu Github"
        >
          <Image
            aria-hidden
            src="/github.svg"
            alt="Github icon"
            width={26}
            height={26}
          />
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/zimbo-sebasti%C3%A3o-3397a1195/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/linkedin.svg"
            alt="linkedin icon"
            width={26}
            height={26}
          />
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://zimbosebastiao.github.io/portfolio/"
          target="_blank"
          rel="meu portfolio"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={26}
            height={26}
          />
        </a>
      </footer>
    </div>
  );
}
