const withNextra = require("nextra")({
  theme: "./theme.tsx",
});

module.exports = withNextra({
  reactStrictMode: true,
});
