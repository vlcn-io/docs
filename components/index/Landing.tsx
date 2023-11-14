import Image from "next/image";
import style from "./landing.module.css";
import Header from "./Header";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithubAlt,
  faDiscord,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Reactive, Realtime, Relational, Replicated } from "./IsoCards";
import Background from "./Background";

const data = {
  heroHead: "State, Simplified",
  heroSubhead:
    "Develop distributed & collaborative applications that sync & react to changing state.",
  heroSubtext: (
    <>
      Vulcan Labs researches and develops databases and state management systems
      to meet the needs of tomorrow&apos;s applications.
    </>
  ),
};

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
      <Background />
      <Header />
      <main>
        <p>
          Most of our time as developers is dealing with state. Ensuring it
          remains valid, syncing it to different devices, protecting it from
          unauthorized access, transforming it into new forms for new use cases,
          indexing it for faster access, and responding to changes in that
          state.
        </p>
        <p>
          Vulcan Labs researches and develops state management primitives for
          the coming generations of software.
        </p>
      </main>
    </div>
  );
}
