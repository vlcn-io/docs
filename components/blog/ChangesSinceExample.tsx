import React, { useState } from "react";
import styles from "./GentleCrdts.module.css";
import PushTbl from "./PushTbl";
import { nanoid } from "../DocGlobals";
import randomWords from "../randomWords";

const wordOptions = { exactly: 2, join: " " };
type State = {
  maxSeen: number;
  rows: {
    id: string;
    content: string;
    row_time: number;
    local_row_time: number;
  }[];
  localTime: number;
}[];
const initialState: State = [
  {
    maxSeen: 0,
    rows: [],
    localTime: 0,
  },
  {
    maxSeen: 0,
    rows: [],
    localTime: 0,
  },
  {
    maxSeen: 0,
    rows: [],
    localTime: 0,
  },
];

function merge(to: State[number], from: State[number], since: number) {
  const fromRows = from.rows.filter((row) => {
    return row.local_row_time > since;
  });
  const toRowMap = new Map();
  to.rows.forEach((row) => {
    toRowMap.set(row.id, row);
  });
  let max = -1;
  fromRows.forEach((row) => {
    if (row.local_row_time > max) {
      max = row.local_row_time;
    }
    if (toRowMap.has(row.id)) {
      const toRow = toRowMap.get(row.id);
      if (toRow.row_time < row.row_time) {
        toRow.content = row.content;
        toRow.row_time = row.row_time;
        toRow.local_row_time = ++to.localTime;
      } else if (toRow.row_time == row.row_time) {
        if (toRow.content < row.content) {
          toRow.content = row.content;
          ++to.localTime;
        }
      }
    } else {
      to.rows.push({ ...row, local_row_time: ++to.localTime });
    }
  });
  max != -1 && (to.maxSeen = max);
}

export default function ChangesSince() {
  const [state, setState] = useState(initialState);

  function mbSince() {
    setState((state) => {
      const newState = structuredClone(state);
      merge(newState[0], newState[1], newState[0].maxSeen);
      return newState;
    });
  }

  function mcSince() {
    setState((state) => {
      const newState = structuredClone(state);
      merge(newState[1], newState[2], newState[1].maxSeen);
      return newState;
    });
  }

  function addRow() {
    setState((state) => {
      const currentState = structuredClone(state);
      const time = ++currentState[2].localTime;
      currentState[2].rows.push({
        id: nanoid(10),
        content: randomWords(wordOptions) as any,
        row_time: time,
        local_row_time: time,
      });
      return currentState;
    });
  }

  function modifyRow() {
    setState((state) => {
      const currentState = structuredClone(state);
      const time = ++currentState[2].localTime;
      const idx = (Math.random() * currentState[2].rows.length) | 0;
      const row = currentState[2].rows[idx];
      row.content = randomWords(wordOptions) as any;
      row.row_time = time;
      row.local_row_time = time;
      return currentState;
    });
  }

  return (
    <div className={styles.push_table}>
      <strong>Node A</strong>
      <div className={styles.tbl_contain}>
        <PushTbl rows={state[0].rows} />
        <button className={styles.btn} onClick={mbSince}>
          Merge changes from B since: {state[0].maxSeen}
        </button>
      </div>
      <strong>Node B</strong>
      <div className={styles.tbl_contain}>
        <PushTbl rows={state[1].rows} />
        <button className={styles.btn} onClick={mcSince}>
          Merge changes from C since: {state[1].maxSeen}
        </button>
      </div>
      <strong>Node C</strong>
      <div className={styles.tbl_contain}>
        <PushTbl rows={state[2].rows} />
        <button
          className={styles.btn}
          style={{ marginRight: 4 }}
          onClick={addRow}
        >
          Add Row
        </button>
        <button className={styles.btn} onClick={modifyRow}>
          Modify Row
        </button>
      </div>
    </div>
  );
}
