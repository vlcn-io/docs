import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const originalRenderPage = ctx.renderPage;
    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
    return (
      <Html className={pageProps.htmlClass} lang="en">
        <Head />
        <body className={pageProps.bodyClass}>
          <Main />
          <NextScript />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-8C2G4330W2"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
           window.dataLayer = window.dataLayer || [];
           function gtag(){window.dataLayer.push(arguments);}
           gtag('js', new Date());
           gtag('config', 'G-8C2G4330W2');
         `}
          </Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
