import Image from "next/image";
import style from "./landing.module.css";
import Header from "./Header";
import { useEffect } from "react";
// @ts-ignore
import CRSQLiteCode from "./CRSQLiteCode.mdx";
// @ts-ignore
import VulcanWebCode from "./VulcanWebCode.mdx";
// @ts-ignore
import MaterialiteCode from "./MaterialiteCode.mdx";
// @ts-ignore
import TreeSQLCode from "./TreeSQLCode.mdx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithubAlt,
  faDiscord,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Background from "./Background";
import Link from "next/link";

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
          Most of our time as developers is spent dealing with state. Ensuring
          it remains valid, syncing it to different devices, protecting it from
          unauthorized access, transforming it into new forms for new use cases,
          indexing it for faster access, and reacting to changes in it.
        </p>
        <p>
          Vulcan Labs researches and develops state management solutions for the
          coming decades of software.
        </p>
        <div className={style.social}>
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
      </main>
      <div className={style.projects}>
        <h2>Production Software</h2>
        <CRSQLite />
        <VulcanWeb />
        <h2>Incubating</h2>
        <Materialite />
        <TypedSQL />
        <h2>Researching</h2>
        <TreeSQL />
        <ul>
          <li>CRDT Substrate</li>
          <li>Rebasing SQLite</li>
        </ul>
      </div>
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
          Copyright © 2023 One Law LLC, All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function CRSQLite() {
  return (
    <div className={style.isoCard}>
      <Link
        href="/docs/cr-sqlite/intro"
        style={{ width: "100%", maxWidth: 180, minWidth: 180 }}
      >
        <Image
          width={180}
          height={140}
          alt="cubes connected in a graph, syncing state between one another"
          className={style.replicated}
          src="/isometrics/replicated.png"
        />
      </Link>
      <div className={style.isoDesc}>
        <h3>CR-SQLite</h3>
        <p>
          An extension to SQLite that allows databases to be merged together.
          This enables SQLite backed applications to take writes while offline
          and then merge those writes with the server, or peers, whenever
          internet connectivity is available. Like Git but for your application
          databases.{" "}
          <Link href="/docs/cr-sqlite/intro" className={style.more}>
            Read More...
          </Link>
        </p>
        <CRSQLiteCode />
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

function VulcanWeb() {
  return (
    <div className={style.isoCard}>
      <Link
        href="/docs/js/first-app"
        style={{ width: "100%", maxWidth: 180, minWidth: 180 }}
      >
        <Image
          style={{ marginRight: 15, marginLeft: 15 }}
          width={150}
          height={200}
          alt="A cube where each side is a feature of vlcn, held by a hand with a lightning bolt on its palm"
          src="/isometrics/hand-cube.png"
        />
      </Link>
      <div className={style.isoDesc}>
        <h3>Vulcan Web</h3>
        <p>
          Combination of projects as they reach maturity, running in the browser
          to create a web & mobile development stack. Vulcan Web will grow over
          time as projects move from incubation to production ready.{" "}
          <Link href="/docs/js/first-app" className={style.more}>
            Read More...
          </Link>
        </p>
        <VulcanWebCode />
        <div className={style.isoSponsors}>
          sponsors: <a href="https://electric-sql.com">electric-sql.com</a>
        </div>
      </div>
    </div>
  );
}

function Materialite() {
  return (
    <div className={style.isoCard}>
      <a
        href="https://github.com/vlcn-io/materialite"
        style={{ width: "100%", maxWidth: 180, minWidth: 180 }}
      >
        <Image
          alt="metal lightning bolt"
          width={150}
          height={200}
          src="/isometrics/realtime.png"
        />
      </a>
      <div className={style.isoDesc}>
        <h3>Materialite</h3>
        <p>
          Incremental computation for JavaScript. When data changes, only run
          computations against the items that changed rather than the entire
          collection.{" "}
          <a
            href="https://observablehq.com/@tantaman/materialite"
            className={style.more}
          >
            Early benchmarks
          </a>{" "}
          show that we can maintain computations over millions of items in less
          than 0.05 milliseconds.{" "}
          <a
            href="https://github.com/vlcn-io/materialite"
            className={style.more}
          >
            Read More...
          </a>
        </p>
        <MaterialiteCode />
        <div className={style.isoSponsors}>
          sponsors: <a href="https://rocicorp.dev/">rocicorp.dev</a>
        </div>
      </div>
    </div>
  );
}

function TypedSQL() {
  return (
    <div className={style.isoCard}>
      <a
        href="https://github.com/vlcn-io/typed-sql"
        style={{ width: "100%", maxWidth: 180, minWidth: 180 }}
      >
        <Image
          alt="folder and file"
          width={150}
          height={150}
          src="/isometrics/transaction.png"
        />
      </a>
      <div className={style.isoDesc}>
        <h3>Typed-SQL</h3>
        <p>
          Updating TypeScript to understand SQL so SQL seamlessly integrates
          with your applicaiton.{" "}
          <a href="https://github.com/vlcn-io/typed-sql" className={style.more}>
            Read More...
          </a>
        </p>
        <div style={{ height: 400, overflow: "hidden" }}>
          <video
            autoPlay
            loop
            src="https://user-images.githubusercontent.com/1009003/255424407-4459edb2-4a52-4641-819d-5805c04d943a.mov"
            data-canonical-src="https://user-images.githubusercontent.com/1009003/255424407-4459edb2-4a52-4641-819d-5805c04d943a.mov"
            controls
            muted
            style={{ maxHeight: 640, minHeight: 200, marginTop: "1em" }}
          ></video>
        </div>
      </div>
    </div>
  );
}

function TreeSQL() {
  return (
    <div className={style.isoCard}>
      <a
        href="https://github.com/tantaman/TreeSQL"
        style={{ width: "100%", maxWidth: 180, minWidth: 180 }}
      >
        <Image alt="scientist" width={150} height={345} src="/scientist.png" />
      </a>
      <div className={style.isoDesc}>
        <h3>TreeQL</h3>
        <p>
          The relational model is great -- you can always access the data you
          need and re-form it into whatever is required. Flat tables, however,
          are not always an ideal structure for an application to deal with its
          data. Would SQL be more palatable if it could understand how to return
          trees of data?{" "}
          <a href="https://github.com/tantaman/TreeSQL" className={style.more}>
            Read More...
          </a>
        </p>
        <TreeSQLCode />
      </div>
    </div>
  );
}

function CRDTSubstrate() {
  return (
    <div className={style.isoCard}>
      <a
        href="/blog/crdt-substrate"
        style={{ width: "100%", maxWidth: 180, minWidth: 180 }}
      >
        <Image alt="scientist" width={150} height={345} src="/scientist.png" />
      </a>
      <div className={style.isoDesc}>
        <h3>Distributed p2p event log</h3>
        <p>
          The relational model is great -- you can always access the data you
          need and re-form it into whatever is required. Flat tables, however,
          are not always an ideal structure for an application to deal with its
          data. Would SQL be more palatable if it could understand how to return
          trees of data?{" "}
          <a href="/blog/crdt-substrate" className={style.more}>
            Read More...
          </a>
        </p>
        <TreeSQLCode />
      </div>
    </div>
  );
}
