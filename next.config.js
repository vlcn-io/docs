const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

module.exports = withNextra({
  reactStrictMode: true,
  // output: "export",
});

// const withNextra = require("nextra")({
//   theme: "./theme.tsx",
// });

// module.exports = withNextra({
//   reactStrictMode: true,
// });
