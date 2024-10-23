import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Calculadora de IMC</title>
        <meta
          name="description"
          content="Calculadora de IMC que fornece orientações nutricionais personalizadas com base no seu IMC."
        />
        <meta
          name="keywords"
          content="IMC, calculadora de IMC, nutrição, saúde, sugestões de dieta, inteligência artificial"
        />
        <meta name="author" content="Zimbo Albertina Sebastião" />

        <meta property="og:title" content="Calculadora de IMC" />
        <meta
          property="og:description"
          content="Calcule seu IMC e receba orientações nutricionais personalizadas."
        />
        {/* <meta property="og:image" content="/path/to/image.jpg" />  */}
        {/* <meta property="og:url" content="https://seusite.com" />  */}
        <meta property="og:type" content="website" />

        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
