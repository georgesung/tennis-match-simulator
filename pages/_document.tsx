import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const isProd = process.env.NODE_ENV === 'production';

  // If it's production, append the sub-path for GitHub Pages.
  const faviconPath = isProd
    ? "/tennis-match-simulator/favicon.ico"
    : "/favicon.ico";

  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href={faviconPath} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
