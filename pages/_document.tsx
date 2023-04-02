import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          type="importmap"
          dangerouslySetInnerHTML={{
            __html: `{"imports": {
            "@vlcn.io/crsqlite-wasm": "https://esm.sh/@vlcn.io/crsqlite-wasm@0.9.1",
            "@vlcn.io/react": "https://esm.sh/@vlcn.io/react@0.9.1",
            "@vlcn.io/rx-tbl": "https://esm.sh/@vlcn.io/rx-tbl@0.8.1",
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "htm/react": "https://esm.sh/htm@3.1.1/react"
          }}`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
