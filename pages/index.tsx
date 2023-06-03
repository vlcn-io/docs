import Image from "next/image";
import style from "./index.module.css";
import { useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithubAlt,
  faDiscord,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

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
            <Link
              href="/background"
              className={style.actionBtn + " " + style.docsBtn}
            >
              Read the Docs
            </Link>
          </div>
          <div className={style.sep}></div>
          <div className={style.heroImgContainer}>
            <Image
              alt="astronaut, student, professor collaborating in real time"
              src="/hero.png"
              fill
              priority
              style={{ objectFit: "contain" }}
              className={style.heroImg}
              sizes="48vw"
            />
          </div>
        </div>
      </section>
      <section className={style.social}>
        <a href="https://github.com/vlcn-io">
          <FontAwesomeIcon icon={faGithubAlt} />
        </a>
        <a href="https://discord.gg/AtdVY6zDW3">
          <FontAwesomeIcon icon={faDiscord} />
        </a>
        <a href="https://twitter.com/vlcnio">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </section>
    </div>
  );
}
