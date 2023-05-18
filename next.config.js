const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
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
        destination: "/articles/intro-to-crdts",
        permanent: true,
      },
      {
        source: "/blog/distributed-recursive-ordering",
        destination: "/articles/distributed-recursive-ordering",
        permanent: true,
      },
      {
        source: "/blog/recursive-ordering-in-sqlite",
        destination: "/articles/recursive-ordering-in-sqlite",
        permanent: true,
      },
      {
        source: "/blog/lww-vs-dag",
        destination: "/articles/lww-vs-dag",
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
