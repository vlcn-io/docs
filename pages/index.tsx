import Image from "next/image";
import style from "./index.module.css";
import { useEffect } from "react";

export async function getStaticProps() {
  return { props: { bodyClass: style.body, htmlClass: style.html } };
}

const data = {
  heroHead: "Distributed State, Simplified",
  heroSubhead:
    "Develop distributed & collaborative applications that sync & react to changing state.",
  heroSubtext: (
    <>
      VLCN augments <a href="https://www.sqlite.org/">SQLite</a>, giving it the
      power of eventual consistency and multi-writer replication. It's like Git,
      for your data.
    </>
  ),
};

export default function Index() {
  useEffect(() => {
    document.querySelector("html")?.classList.add(style.html);
    document.querySelector("body")?.classList.add(style.body);
    return () => {
      document.querySelector("html")?.classList.remove(style.html);
      document.querySelector("body")?.classList.remove(style.body);
    };
  }, []);
  return (
    <div className={style.root}>
      <header className={style.header}>
        <div className={style.logoImg}>
          <Image
            alt="Vulcan forging new weapons, in the battle against complexity, on an anvil"
            src="/logo.png"
            fill
            priority
            style={{ objectFit: "contain" }}
            sizes="(max-width: 1600px) 12vw, (max-width: 800px) 20vw, 6vw"
          />
        </div>
      </header>
      <section className={style.hero}>
        <div className={style.heroInner}>
          <div className={style.heroCopy}>
            <h1>{data.heroHead}</h1>
            <h3>{data.heroSubhead}</h3>
            <p className={style.subtext}>{data.heroSubtext}</p>
            <a
              href="./waitlist.html"
              className={style.actionBtn + " " + style.waitlistBtn}
            >
              Join The Beta
            </a>
            <a
              href="/background"
              className={style.actionBtn + " " + style.docsBtn}
            >
              Read the Docs
            </a>
          </div>
          <div className={style.sep}></div>
          <div className={style.heroImgContainer}>
            <img src="/hero.png" className={style.heroImg}></img>
          </div>
        </div>
      </section>
      <section className={style.social}>
        <a href="https://github.com/vlcn-io">
          <i className="fa-brands fa-github-alt"></i>
        </a>
        <a href="https://discord.gg/AtdVY6zDW3">
          <i className="fa-brands fa-discord"></i>
        </a>
        <a href="https://twitter.com/vlcnio">
          <i className="fa-brands fa-twitter"></i>
        </a>
      </section>
    </div>
  );
}
