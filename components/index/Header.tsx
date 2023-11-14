import Link from "next/link";
import style from "./header.module.css";

export default function Header() {
  return (
    <header className={style.header}>
      <div className={style.logo}>
        <h1>Vulcan Labs</h1>
        <p>State, Simplified</p>
      </div>
      <div className={style.nav}>
        <span>
          <Link href="/docs">Docs</Link>
        </span>{" "}
        |{" "}
        <span>
          <Link href="/examples">Examples</Link>
        </span>{" "}
        |{" "}
        <span>
          <Link href="/blog">Blog</Link>
        </span>{" "}
        |{" "}
        <span>
          <Link href="/about">About</Link>
        </span>
      </div>
    </header>
  );
}
