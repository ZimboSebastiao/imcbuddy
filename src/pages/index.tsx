import Image from "next/image";
import Head from "next/head";
import localFont from "next/font/local";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Script from "next/script";
import { gemini } from "./api/gemini";

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
  const [idade, setIdade] = useState("");
  const [imc, setImc] = useState<number | null>(null);
  const [sugestao, setSugestao] = useState("");
  const [loading, setLoading] = useState(false);

  const tabelaMarkdown = `
 
   ${sugestao}            
  `;

  // Função para calcular o IMC
  const calcularIMC = async () => {
    const alturaMetros = parseFloat(altura);
    const pesoKg = parseFloat(peso);

    if (alturaMetros > 0 && pesoKg > 0) {
      setLoading(true);
      const imcCalculado = pesoKg / (alturaMetros * alturaMetros);
      setImc(parseFloat(imcCalculado.toFixed(2)));

      // Mensagem para enviar ao assistente de nutrição
      const mensagem = `Meu IMC é ${imcCalculado.toFixed(
        2
      )}, peso é ${pesoKg} kg, altura é ${alturaMetros} m e idade é ${idade} anos. Quais são suas sugestões de nutrição?`;
      const resposta = await gemini(mensagem);
      setSugestao(resposta);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Calculadora de IMC</title>
        <script>window.yaContextCb=window.yaContextCb||[]</script>
        <script src="https://yandex.ru/ads/system/context.js" async></script>
      </Head>
      {/* Carregar o script Yandex.RTB */}
      <Script
        src="https://yandex.ru/ads/system/context.js"
        strategy="lazyOnload"
      />
      <Script id="yandex-rtb" strategy="lazyOnload">
        {`window.yaContextCb = window.yaContextCb || [];
  window.yaContextCb.push(() => {
    Ya.Context.AdvManager.render({
      "blockId": "R-A-12827422-1",
      "type": "floorAd",
      "platform": "desktop"
    });
    // Agora que o primeiro anúncio foi carregado, podemos carregar o segundo
    window.yaContextCb.push(() => {
      Ya.Context.AdvManager.render({
        "blockId": "R-A-12827422-3",
        "renderTo": "yandex_rtb_R-A-12827422-3"
      });
    });
  });`}
      </Script>

      <Script
        id="yandex-rtb-script"
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Erro ao carregar o script", e);
        }}
        onLoad={() => console.log("Script carregado com sucesso!")}
        dangerouslySetInnerHTML={{
          __html: `(function(e, x, pe, r, i, me, nt) {
      e[i] = e[i] || function() {
        (e[i].a = e[i].a || []).push(arguments);
      };
      me = x.createElement(pe);
      me.async = 1;
      me.src = r;
      nt = x.getElementsByTagName(pe)[0];
      me.addEventListener("error", function() {
        function cb(t) {
          t = t[t.length - 1];
          if (typeof t === "function") t({ flags: {} });
        }
        if (Array.isArray(e[i].a)) e[i].a.forEach(cb);
        e[i] = function() {
          cb(arguments);
        };
      });
      nt.parentNode.insertBefore(me, nt);
    })(window, document, "script", "https://abt.s3.yandex.net/expjs/latest/exp.js", "ymab");
    ymab("metrika.98887785", "setConfig", { enableSetYmUid: true });
    ymab("metrika.98887785", "init");`,
        }}
      />

      {/* O bloco para o segundo anúncio */}
      <div id="yandex_rtb_R-A-12827422-3"></div>

      <div
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col items-center justify-center min-h-screen p-8 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
      >
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <p className="text-lg">Carregando... ⏳</p>
          </div>
        )}

        <main className="flex flex-col gap-8 items-center">
          <h1 className="text-2xl font-bold">Calculadora de IMC</h1>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            {/* Inputs de peso e altura */}
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Idade"
                value={idade}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (valor.length <= 2) {
                    setIdade(valor);
                  }
                }}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Peso (kg)"
                value={peso}
                onChange={(e) => {
                  const valor = e.target.value;

                  if (valor.length <= 3) {
                    setPeso(valor);
                  }
                }}
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
                  const [parteDecimal] = valor.split(".");

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
              <p className="imc">
                Seu Índice de Massa Corporal é: <strong>{imc}</strong>
              </p>
            </div>
          )}
          {/* Exibir sugestões de nutrição */}
          {sugestao && (
            <div className="flex flex-col items-center mt-4">
              <h2 className="text-lg font-bold">Orientações Nutricionais</h2>
              <ReactMarkdown className="minha-classe">
                {tabelaMarkdown}
              </ReactMarkdown>
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
    </>
  );
}
