import { useEffect } from "react";
import runify from "../../interactive/runnable-code.js";

export default function Common() {
  useEffect(() => {
    window.nanoid = (t = 21) =>
      crypto
        .getRandomValues(new Uint8Array(t))
        .reduce(
          (t, e) =>
            (t +=
              (e &= 63) < 36
                ? e.toString(36)
                : e < 62
                ? (e - 26).toString(36).toUpperCase()
                : e > 62
                ? "-"
                : "_"),
          ""
        );
    window.onload = runify;
  }, []);
}
