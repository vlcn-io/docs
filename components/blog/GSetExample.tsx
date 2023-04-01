import React, { useEffect, useState } from "react";
import styles from "./GSetExample.module.css";
import randomWords from "../randomWords";
import Tbl from "./Tbl";
import type { Row } from "./Tbl";
import { nanoid } from "../DocGlobals";

const wordOptions = { exactly: 2, join: " " };
const makeRow = (classname: string) => ({
  id: nanoid(10),
  content: randomWords(wordOptions) as string,
  classname,
});

export default function GSetExample() {
  const [rowsA, setRowsA] = useState<Row[]>([]);
  const [rowsB, setRowsB] = useState<Row[]>([]);
  // so server component matches client.
  useEffect(() => {
    setRowsA(Array.from({ length: 3 }).map(() => makeRow(styles.a_row)));
    setRowsB(Array.from({ length: 3 }).map(() => makeRow(styles.b_row)));
  }, []);
  const [rowsMerged, setRowsMerged] = useState<Row[]>([]);

  const addRow = (coll: Row[], setter: (x: Row[]) => void, classname: string) =>
    setter([...coll, makeRow(classname)]);

  const merge = () => {
    const merged = [];
    for (let i = 0; i < Math.max(rowsA.length, rowsB.length); i++) {
      if (i < rowsA.length) {
        merged.push(rowsA[i]);
      }
      if (i < rowsB.length) {
        merged.push(rowsB[i]);
      }
    }
    setRowsMerged(merged);
  };

  return (
    <div>
      <div className={styles.pair_tables}>
        <div className={styles.tbl_contain}>
          <strong>Node A</strong>
          <div className={styles.tbl_a}>
            <Tbl rows={rowsA} />
          </div>
          <button
            className={styles.btn}
            onClick={() => addRow(rowsA, setRowsA, styles.a_row)}
          >
            Add Row
          </button>
        </div>
        <div className={styles.tbl_contain}>
          <strong>Node B</strong>
          <div className={styles.tbl_b}>
            <Tbl rows={rowsB} />
          </div>
          <button
            className={styles.btn}
            onClick={() => addRow(rowsB, setRowsB, styles.b_row)}
          >
            Add Row
          </button>
        </div>
      </div>
      <div className={styles.merge_contain}>
        <button className={styles.btn} onClick={merge}>
          ↓ Merge! ↓
        </button>
        <br />
        <strong>Merge Result</strong>
        <div className={styles.tbl_merge}>
          <Tbl rows={rowsMerged} />
        </div>
      </div>
    </div>
  );
}
