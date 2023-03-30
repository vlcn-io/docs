import type { NextraThemeLayoutProps } from "nextra";

export default function Layout(props: NextraThemeLayoutProps) {
  const { children } = props;
  // const str = JSON.stringify(props);
  console.log(props);
  switch (props.pageOpts.frontMatter.layout) {
    case "home":
      return <>{children}</>;
  }
  return (
    <div>
      <h1>My Theme</h1>
      <div style={{ border: "1px solid" }}>{children}</div>
    </div>
  );
}
