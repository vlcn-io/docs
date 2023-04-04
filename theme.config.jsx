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
  docsRepositoryBase: "https://github.com/vlcn-io/docs/tree/main",
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
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="keywords"
        content="software, crdts, crrs, sqlite, conflict-free"
      />
      <meta name="copyright" content="© 2022 One Law LLC" />
      <meta
        name="description"
        content="Develop multi-device & local-first applications that sync and react to changing state in real-time."
      />
      <meta property="og:site_name" content="vlcn.io" />
      <meta property="og:title" content="Distributed State, Simplified" />
      <meta
        property="og:description"
        content="Develop multi-device & local-first applications that sync and react to changing state in real-time."
      />
      <meta property="og:image" content="https://vlcn.io/assets/hero.png" />
      <meta
        property="og:image:alt"
        content="convergent-replicated-reactive-sql"
      />
      <meta property="og:image:width" content="825" />
      <meta property="og:image:height" content="674" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://vlcn.io/assets/hero.png" />
      <meta name="twitter:image:alt" content="vlcn" />
      <meta name="twitter:site" content="@vlcnio" />
    </>
  ),
  // ...
};
