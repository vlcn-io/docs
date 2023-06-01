import { useConfig } from "nextra-theme-docs";

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
  chat: {
    link: "https://discord.gg/AtdVY6zDW3",
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
    </>
  ),
  useNextSeoProps() {
    const { frontMatter } = useConfig();
    return {
      additionalLinkTags: [
        {
          href: "/favicon-32x32.png",
          rel: "icon",
          sizes: "32x32",
          type: "image/png",
        },
        {
          href: "/favicon-16x16.png",
          rel: "icon",
          sizes: "16x16",
          type: "image/png",
        },
      ],
      additionalMetaTags: [
        { content: "en", httpEquiv: "Content-Language" },
        { content: "vlcn.io", name: "apple-mobile-web-app-title" },
        { content: "#fff", name: "msapplication-TileColor" },
      ],
      description: frontMatter.description || "Distributed State, Simplified",
      openGraph: {
        description: frontMatter.description || "Distributed State, Simplified",
        siteName: "vlcn.io",
        images: [
          { url: frontMatter.image || "https://vlcn.io/assets/hero.png" },
        ],
      },
      titleTemplate: "%s – vlcn.io",
      twitter: {
        cardType: "summary_large_image",
        site: "@vlcnio",
      },
    };
  },
  // ...
};
