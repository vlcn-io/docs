import React from "react";
import { useEffect } from "react";

export const nanoid = (t = 21) =>
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

export default function DocGlobals() {
  useEffect(() => {
    (window as any).nanoid = nanoid;
  }, []);
  return <div></div>;
}
