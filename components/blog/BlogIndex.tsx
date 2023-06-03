import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import style from "./BlogIndex.module.css";

export default function BlogIndex() {
  return (
    <div className={style.root}>
      <header>
        <h1>Blog</h1>
        <p>Updates, releases and explorations by the Vulcan team.</p>
        <hr />
      </header>
      {getPagesUnderRoute("/blog").map((page) => {
        const casted = page as any;
        if (casted.frontMatter?.draft) {
          return null;
        }
        return (
          <div key={page.route}>
            <h2>
              <Link href={page.route}>
                {page.meta?.title || casted.frontMatter?.title || page.name}
              </Link>
            </h2>
            {casted.frontMatter?.date ? (
              <Link className={style.date} href={page.route}>
                {casted.frontMatter.date}
              </Link>
            ) : null}
            <p className={style.description}>
              {casted.frontMatter?.description}{" "}
            </p>
            <span className={style.readMore}>
              <Link href={page.route}>{"Read more →"}</Link>
            </span>
            <hr></hr>
          </div>
        );
      })}
    </div>
  );
}
