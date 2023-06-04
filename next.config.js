const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
});

module.exports = withNextra({
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/blog/gentle-intro-to-crdts.html",
        destination: "/blog/intro-to-crdts",
        permanent: true,
      },
      {
        source: "/articles/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
      {
        source: "/background",
        destination: "/docs",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.wasm/,
      type: "asset/resource",
    });
    return config;
  },
  // output: "export",
});

// const withNextra = require("nextra")({
//   theme: "./theme.tsx",
// });

// module.exports = withNextra({
//   reactStrictMode: true,
// });
