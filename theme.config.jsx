export default {
  logo: <img src="/logo.png" style={{ height: 48 }} />,
  project: {
    link: "https://github.com/vlcn-io/cr-sqlite",
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: "light",
    forcedTheme: "light",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – vlcn.io",
    };
  },
  docsRepositoryBase: "https://github.com/tantaman/vlcn-nextra/blob/main",
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://vlcn.io" target="_blank">
          One Law LLC
        </a>
      </span>
    ),
  },
  // ...
};
