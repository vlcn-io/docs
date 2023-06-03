import Image from "next/image";
import style from "./index.module.css";
import { useEffect } from "react";

export async function getStaticProps() {
  return { props: { bodyClass: style.body, htmlClass: style.html } };
}

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
            alt="Vulcan forging new weapons, in the battle against compleixty, on an anvil"
            src="/logo.png"
            fill
            priority
            style={{ objectFit: "contain" }}
            sizes="(max-width: 1600px) 12vw, (max-width: 800px) 20vw, 6vw"
          />
        </div>
      </header>
      <section className={style.hero}></section>
    </div>
  );
}
