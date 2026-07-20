import { useEffect } from "react";

// On a static host there is no server to run Next.js `redirects()`, so the
// legacy redirects are reproduced here. GitHub Pages serves this page as
// `404.html` for any unmatched path, letting us map old URLs client-side.
function resolveRedirect(pathname: string): string | null {
  // /articles/:path*  ->  /blog/:path*
  if (pathname.startsWith("/articles/")) {
    return "/blog/" + pathname.slice("/articles/".length);
  }
  // Exact-path legacy redirects.
  const exact: Record<string, string> = {
    "/background": "/docs",
    "/blog/gentle-intro-to-crdts.html": "/blog/intro-to-crdts",
  };
  return exact[pathname] ?? null;
}

export default function NotFound() {
  useEffect(() => {
    const target = resolveRedirect(window.location.pathname);
    if (target) {
      window.location.replace(target);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "6rem 1rem" }}>
      <h1>404 – Page Not Found</h1>
      <p>
        The page you&rsquo;re looking for doesn&rsquo;t exist. Head back to{" "}
        <a href="/">vlcn.io</a> or the <a href="/docs">docs</a>.
      </p>
    </div>
  );
}
