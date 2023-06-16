import Image from "next/image";
import style from "./landing.module.css";
import Header from "./Header";
import { useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithubAlt,
  faDiscord,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Reactive, Realtime, Relational, Replicated } from "./IsoCards";

const data = {
  heroHead: "Distributed State, Simplified",
  heroSubhead:
    "Develop distributed & collaborative applications that sync & react to changing state.",
  heroSubtext: (
    <>
      Vulcan augments <a href="https://www.sqlite.org/">SQLite</a>, giving it
      the power of eventual consistency and multi-writer replication. It&apos;s
      like Git, for your data.
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
      <Header />
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
              href="/docs"
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
      <main className={style.main}>
        <Relational />
        <Replicated />
        <Reactive />
        <Realtime />
      </main>
      <footer className={style.footer}>
        <Image
          className={style.flogo}
          alt="Vulcan forging new weapons, in the battle against complexity, on an anvil"
          src="/logo.png"
          width={182}
          height={76}
        />
        <hr />
        <div className={style.fsocial}>
          <a href="https://github.com/vlcn-io">
            <FontAwesomeIcon icon={faGithubAlt} />
          </a>
          <a href="https://discord.gg/AtdVY6zDW3">
            <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a href="https://twitter.com/vlcnio">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
        <div className={style.copyright}>
          Copyright © 2022 One Law LLC, All rights reserved.
        </div>
      </footer>
    </div>
  );
}
