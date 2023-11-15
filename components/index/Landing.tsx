import Image from "next/image";
import style from "./landing.module.css";
import Header from "./Header";
import { useEffect } from "react";
import CRSQLiteCode from "./CRSQLiteCode.mdx";
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
          Most of our time as developers is spent dealing with state. Ensuring
          it remains valid, syncing it to different devices, protecting it from
          unauthorized access, transforming it into new forms for new use cases,
          indexing it for faster access, and reacting to changes in it.
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
        <VulcanWeb />
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
          An extension to SQLite that allows different SQLite databases to be
          merged together. This allows SQLite backed applications to take writes
          while offline and then merge those writes with the server, or peers,
          when internet connectivity is available. Kind of like Git, for your
          application databases.{" "}
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

const vlcnWebCodeString = `function App() {
  ...
  const todos = useQuery(\`SELECT * FROM todo WHERE filter = ?\`, [filter]);
  return <div>{todos.map(todo)}</div>;
}`;
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
          Vulcan Labs projects combined and running in the browser to create a
          web & mobile development stack. Vulcan Web grows over time as projects
          move from incubation to production ready.{" "}
          <Link href="/docs/js/first-app" className={style.more}>
            Read More...
          </Link>
        </p>
        <pre>
          <code>{vlcnWebCodeString}</code>
        </pre>
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
          <a href="https://observablehq.com/@tantaman/materialite">
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
        <div className={style.isoSponsors}>
          sponsors: <a href="https://rocicorp.dev/">rocicorp.dev</a>
        </div>
      </div>
    </div>
  );
}

function TypedSQL() {}
