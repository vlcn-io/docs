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
    return () => {
      // // close the dbs registered by any demos.
      // // @ts-ignore
      // window.db?.close();
      // // @ts-ignore
      // window.db1?.close();
      // // @ts-ignore
      // window.db2?.close();
      // // @ts-ignore
      // window.db3?.close();
      // // @ts-ignore
      // window.db = null;
      // // @ts-ignore
      // window.db1 = null;
      // // @ts-ignore
      // window.db2 = null;
      // // @ts-ignore
      // window.db3 = null;
    };
  }, []);
  return <div></div>;
}
