import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";

export default function BlogIndex() {
  return getPagesUnderRoute("/blog").map((page) => {
    const casted = page as any;
    return (
      <div key={page.route}>
        <Link href={page.route}>
          {page.meta?.title || casted.frontMatter?.title || page.name}
        </Link>
        <p>
          {casted.frontMatter?.description}{" "}
          <span>
            <Link href={page.route}>{"Read more →"}</Link>
          </span>
        </p>
        {casted.frontMatter?.date ? <p>{casted.frontMatter.date}</p> : null}
      </div>
    );
  });
}
