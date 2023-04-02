import styles from "@/styles/Home.module.css";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faTwitter,
  faGithubAlt,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function Index() {
  useEffect(() => {
    document.querySelector("html")?.classList.add(styles.html);
    document.querySelector("body")?.classList.add(styles.body);
    return () => {
      document.querySelector("html")?.classList.remove(styles.html);
      document.querySelector("body")?.classList.remove(styles.body);
    };
  }, []);
  return (
    <>
      <header>
        <Image alt="" src="/logo.png" className={styles["logo-img"]}></Image>
      </header>
      <section className={styles.hero}>
        <div className={styles["hero-inner"]}>
          <div className={styles["hero-copy"]}>
            <h1>Device Sync Simplified</h1>
            <h3>
              Develop multi-device applications that react to changing state in
              real-time.
            </h3>
            <p className={styles["subtext"]}>
              VLCN is an open-source library for state management and sync. VLCN
              augments <a href="https://www.sqlite.org/">SQLite</a>, giving it
              the power to merge changes from other peers, notify your
              application of changes, and traverse remote datasets.
            </p>
            <a
              href="./waitlist.html"
              className={styles["action-btn"] + " " + styles["waitlist-btn"]}
            >
              Join The Beta
            </a>
            <a
              href="background"
              className={styles["action-btn"] + " " + styles["docs-btn"]}
            >
              Read the Docs
            </a>
          </div>
          <div className={styles["sep"]}></div>
          <div className={styles["hero-img-container"]}>
            <Image
              alt=""
              src="/hero.png"
              className={styles["hero-img"]}
            ></Image>
          </div>
        </div>
      </section>
      <section className={styles["social"]}>
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
      <main>
        <div className={styles["iso-card"]}>
          <div>
            <Image
              alt=""
              className={styles["replicated"]}
              src="/isometrics/replicated.png"
            ></Image>
          </div>
          <div className={styles["sep"]}></div>
          <div className={styles["iso-cap"]}>
            <h1>Replicated</h1>
            <p>
              Replicate and merge state without conflict between multiple
              devices and users -- even with offline changes. Devices can write
              data whenever they need to and sync whenever network connectivity
              is available.
            </p>
          </div>
        </div>
        <div className={styles["iso-card"]}>
          <div>
            <Image
              alt=""
              className={styles["reactive"]}
              src="/isometrics/reactive.png"
            ></Image>
          </div>
          <div className={styles["sep"]}></div>
          <div className={styles["iso-cap"]}>
            <h1>Reactive</h1>
            <p>
              As state changes locally or is synced from other devices, your
              application is kept up to date -- all the way from the network to
              the database to the UI.
            </p>
          </div>
        </div>
        <div className={styles["iso-card"]}>
          <div>
            <Image alt="" src="/isometrics/realtime.png"></Image>
          </div>
          <div className={styles["sep"]}></div>
          <div className={styles["iso-cap"]}>
            <h1>Real-time</h1>
            <p>
              Break the speed of light by reading and writing data locally;
              don&apos;t wait for network round-trips.
            </p>
          </div>
        </div>
        <div className={styles["iso-card"]}>
          <div>
            <Image alt="" src="/isometrics/hand-cube.png"></Image>
          </div>
          <div className={styles["sep"]}></div>
          <div className={styles["iso-cap"]}>
            <h1>Relational</h1>
            <p>
              You have all the power of SQL at your fingertips, augmented with
              the powers of reactivity and eventually consistent multi-writer
              replication. See{" "}
              <a href="https://github.com/aphrodite-sh/cr-sqlite">
                Convergent, Replicated, SQLite
              </a>
            </p>
          </div>
        </div>
      </main>
      <section className={styles["examples"]}>
        <center>
          <h2>
            <a href="background">Get Started</a>
          </h2>
        </center>
      </section>
      <section className={styles["use"]}></section>
      <footer>
        <div>
          <Image alt="" src="/logo.png" width="182"></Image>
        </div>
        <hr />
        <div className={styles["fsocial"]}>
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
        <div className={styles["copyright"]}>
          Copyright © 2023 One Law LLC, All rights reserved.
        </div>
      </footer>
    </>
  );
}
