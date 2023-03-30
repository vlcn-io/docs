export default function Index() {
  return (
    <>
      <header>
        <img src="./assets/logo.png" className="logo-img"></img>
      </header>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Device Sync Simplified</h1>
            <h3>
              Develop multi-device applications that react to changing state in
              real-time.
            </h3>
            <p className="subtext">
              VLCN is an open-source library for state management and sync. VLCN
              augments <a href="https://www.sqlite.org/">SQLite</a>, giving it
              the power to merge changes from other peers, notify your
              application of changes, and traverse remote datasets.
            </p>
            <a href="./waitlist.html" className="action-btn waitlist-btn">
              Join The Beta
            </a>
            <a href="docs/background-concepts" className="action-btn docs-btn">
              Read the Docs
            </a>
          </div>
          <div className="sep"></div>
          <div className="hero-img-container">
            <img src="./assets/hero.png" className="hero-img"></img>
          </div>
        </div>
      </section>
      <section className="social">
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
      <main>
        <div className="iso-card">
          <div>
            <img
              className="replicated"
              src="assets/isometrics/replicated.png"
            ></img>
          </div>
          <div className="sep"></div>
          <div className="iso-cap">
            <h1>Replicated</h1>
            <p>
              Replicate and merge state without conflict between multiple
              devices and users -- even with offline changes. Devices can write
              data whenever they need to and sync whenever network connectivity
              is available.
            </p>
          </div>
        </div>
        <div className="iso-card">
          <div>
            <img
              className="reactive"
              src="assets/isometrics/reactive.png"
            ></img>
          </div>
          <div className="sep"></div>
          <div className="iso-cap">
            <h1>Reactive</h1>
            <p>
              As state changes locally or is synced from other devices, your
              application is kept up to date -- all the way from the network to
              the database to the UI.
            </p>
          </div>
        </div>
        <div className="iso-card">
          <div>
            <img src="assets/isometrics/realtime.png"></img>
          </div>
          <div className="sep"></div>
          <div className="iso-cap">
            <h1>Real-time</h1>
            <p>
              Break the speed of light by reading and writing data locally;
              don't wait for network round-trips.
            </p>
          </div>
        </div>
        <div className="iso-card">
          <div>
            <img src="assets/isometrics/hand-cube.png"></img>
          </div>
          <div className="sep"></div>
          <div className="iso-cap">
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
      <section className="examples">
        <center>
          <h2>
            <a href="docs/getting-started">Get Started</a>
          </h2>
        </center>
      </section>
      <section className="use"></section>
      <footer>
        <div>
          <img src="assets/logo.png" width="182"></img>
        </div>
        <hr />
        <div className="fsocial">
          <a href="https://github.com/vlcn-io">
            <i className="fa-brands fa-github-alt"></i>
          </a>
          <a href="https://discord.gg/AtdVY6zDW3">
            <i className="fa-brands fa-discord"></i>
          </a>
          <a href="https://twitter.com/vlcnio">
            <i className="fa-brands fa-twitter"></i>
          </a>
        </div>
        <div className="copyright">
          Copyright © 2022 One Law LLC, All rights reserved.
        </div>
      </footer>
    </>
  );
}
