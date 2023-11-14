import style from "./header.module.css";

export default function Header() {
  return (
    <header className={style.header}>
      <h1>Vulcan Labs</h1>
      <p>State, Simplified</p>
    </header>
  );
}
