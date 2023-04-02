import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { AppProps } from "next/app";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { clearResources } from "../components/CodeNode";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      clearResources();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return <Component {...pageProps} />;
}
