import Image from "next/image";
import style from "./landing.module.css";
import Link from "next/link";

export default function Header() {
  return (
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
      <div className={style.sep} />
      <div className={style.headerNav}>
        <span>
          <Link href="/docs">Docs</Link>
        </span>
        <span>
          <Link href="/example">Examples</Link>
        </span>
        <span>
          <Link href="/blog">Blog</Link>
        </span>
      </div>
    </header>
  );
}
