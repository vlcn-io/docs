const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
});

module.exports = withNextra({
  reactStrictMode: true,
  output: "export",
  images: {
    // The static export has no server to run Next's image optimizer.
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.wasm/,
      type: "asset/resource",
    });
    return config;
  },
});

// NOTE: `rewrites()` and `redirects()` were removed because they require a
// Node server and are ignored by `output: "export"`. The old redirects
// (/articles/* -> /blog/*, /background -> /docs, and the legacy
// gentle-intro-to-crdts.html post) are now handled client-side in
// `pages/404.tsx`, which GitHub Pages serves as `404.html`.
