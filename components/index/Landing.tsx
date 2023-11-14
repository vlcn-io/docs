import Image from "next/image";
import style from "./landing.module.css";
import Header from "./Header";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithubAlt,
  faDiscord,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Reactive, Realtime, Relational, Replicated } from "./IsoCards";
import Background from "./Background";
import Link from "next/link";

const data = {
  heroHead: "State, Simplified",
  heroSubhead:
    "Develop distributed & collaborative applications that sync & react to changing state.",
  heroSubtext: (
    <>
      Vulcan Labs researches and develops databases and state management systems
      to meet the needs of tomorrow&apos;s applications.
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
      <Background />
      <Header />
      <main>
        <p>
          Most of our time as developers is dealing with state. Ensuring it
          remains valid, syncing it to different devices, protecting it from
          unauthorized access, transforming it into new forms for new use cases,
          indexing it for faster access, and reacting to changes in state.
        </p>
        <p>
          Vulcan Labs researches and develops state management solutions for the
          coming generations of software.
        </p>
        <div className={style.social}></div>
      </main>
      <div className={style.projects}>
        <h2>Production Software</h2>
        <CRSQLite />
        <h2>Incubating</h2>
        <Materialite />
        <h2>Researching</h2>
      </div>
    </div>
  );
}

function CRSQLite() {
  return (
    <div className={style.isoCard}>
      <Image
        width={150}
        height={200}
        alt="A cube where each side is a feature of vlcn, held by a hand with a lightning bolt on its palm"
        src="/isometrics/hand-cube.png"
      />
      <div className={style.isoDesc}>
        <h3>CR-SQLite</h3>
        <p>
          An extension to SQLite that allows different SQLite databases to be
          merged together. This unlocks the ability for applications that can be
          used offline and merge their data back with the server, or peers, when
          internet connectivity is available.{" "}
          <Link href="/docs/cr-sqlite/intro">Read More</Link>
        </p>
        <div className={style.isoSponsors}>
          sponsors: <a href="https://fly.io">fly.io</a>,{" "}
          <a href="https://expo.dev">expo.dev</a>,{" "}
          <a href="https://electric-sql.com">electric-sql.com</a>,{" "}
          <a href="https://turso.tech">turso.tech</a>
        </div>
      </div>
    </div>
  );
}

function Materialite() {
  return (
    <div className={style.isoCard}>
      <Image
        alt="metal lightning bolt"
        width={150}
        height={200}
        src="/isometrics/realtime.png"
      />
      <div className={style.isoDesc}>
        <h3>Materialite</h3>
        <p>
          Incremental computation for JavaScript. When data changes, only run
          your computation against the items that changed rather than the entire
          collection.{" "}
          <a href="https://github.com/vlcn-io/materialite/tree/main">
            Read More
          </a>
        </p>
        <div className={style.isoSponsors}>
          sponsors: <a href="https://rocicorp.dev/">Rocicorp</a>
        </div>
      </div>
    </div>
  );
}

function TypedSQL() {}
