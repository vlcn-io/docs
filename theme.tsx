import type { NextraThemeLayoutProps } from "nextra";
import DocsLayout from "@/components/DocsLayout";

export default function Layout(props: NextraThemeLayoutProps) {
  const { children } = props;
  switch (props.pageOpts.frontMatter.layout) {
    case "home":
      return <>{children}</>;
    case "docs":
      return <DocsLayout {...props}>{children}</DocsLayout>;
  }
  return (
    <div>
      <h1>My Theme</h1>
      <div style={{ border: "1px solid" }}>{children}</div>
    </div>
  );
}
