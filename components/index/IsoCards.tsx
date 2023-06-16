import Image from "next/image";
import style from "./landing.module.css";

export function Replicated() {
  return (
    <div className={style.isoCard}>
      <Image
        width={160}
        height={160}
        alt="cubes connected in a graph, syncing state between one another"
        className={style.replicated}
        src="/isometrics/replicated.png"
      />
      <div className={style.sep}></div>
      <div className={style.isoCap}>
        <h1>Replicated</h1>
        <p>
          Replicate and merge state without conflict between multiple devices
          and users -- even with offline changes. Devices can write data
          whenever they need to and sync whenever network connectivity is
          available.
        </p>
      </div>
    </div>
  );
}

export function Relational() {
  return (
    <div className={style.isoCard}>
      <Image
        width={150}
        height={200}
        alt="A cube where each side is a feature of vlcn, held by a hand with a lightning bolt on its palm"
        src="/isometrics/hand-cube.png"
      />
      <div className={style.sep}></div>
      <div className={style.isoCap}>
        <h1>Relational</h1>
        <p>You have all the power of SQL at your fingertips.</p>
        <p>Start with familiar create table statements.</p>
        <p>
          Upgrade tables that need to be distributed to conflict-free replicated
          relations
        </p>
        <p>Query and update your data as you&apos;d expect</p>
      </div>
    </div>
  );
}

export function Reactive() {
  return (
    <div className={style.isoCard}>
      <Image
        width={200}
        height={190}
        alt="A spherical computer inside an electron field"
        className={style.reactive}
        src="/isometrics/reactive.png"
      />
      <div className={style.sep}></div>
      <div className={style.isoCap}>
        <h1>Reactive</h1>
        <p>
          As state changes locally or is synced from other devices, your
          application is kept up to date -- all the way from the network to the
          database to the UI.
        </p>
      </div>
    </div>
  );
}

export function Realtime() {
  return (
    <div className={style.isoCard}>
      <Image
        alt="metal lightning bolt"
        width={150}
        height={200}
        src="/isometrics/realtime.png"
      />
      <div className={style.sep}></div>
      <div className={style.isoCap}>
        <h1>Real-time</h1>
        <p>
          Break the speed of light by reading and writing data locally;
          don&apos;t wait for network round-trips.
        </p>
      </div>
    </div>
  );
}
