import React, { useState } from "react";
import styles from "./GentleCrdts.module.css";
import TieTbl from "./TieTbl";

type NodeName = "a" | "b" | "c";
const initialState: {
  [key in NodeName]: {
    node: NodeName;
    id: string;
    content: string;
    time: string;
    mergedWith: NodeName[];
  };
} = {
  a: {
    node: "a",
    id: "x",
    content: "z",
    time: "12:00:00",
    mergedWith: [],
  },
  b: {
    node: "b",
    id: "x",
    content: "b",
    time: "12:00:00",
    mergedWith: [],
  },
  c: {
    node: "c",
    id: "x",
    content: "a",
    time: "12:00:00",
    mergedWith: [],
  },
};

export default function TieBreakExample() {
  const [state, setState] = useState(initialState);
  const [tieBreaker, setTieBreaker] = useState<
    "value" | "nodeId" | "reject" | "take"
  >("nodeId");
  function reset() {
    setState(initialState);
  }

  function hasMerged(target: NodeName, source: NodeName) {
    return state[target].mergedWith.includes(source);
  }

  function merge(target: NodeName, source: NodeName) {
    setState((state) => {
      const newState = structuredClone(state);
      const nodeState = newState[target];
      const otherNode = newState[source];
      // TODO: Tie break
      switch (tieBreaker) {
        case "value":
          if (nodeState.content < otherNode.content) {
            nodeState.content = otherNode.content;
          }
          break;
        case "nodeId":
          if (nodeState.node < otherNode.node) {
            nodeState.content = otherNode.content;
          }
          break;
        case "reject":
          break;
        case "take":
          nodeState.content = otherNode.content;
          break;
      }
      nodeState.mergedWith.push(source);
      return newState;
    });
  }

  return (
    <div className={styles.ex_tie}>
      <fieldset
        className={styles.fieldset}
        onChange={(e) => {
          // @ts-ignore
          setTieBreaker(e.target.value as any);
        }}
      >
        <legend>Tie Breaker:</legend>
        <label style={{ color: "green" }}>
          <input
            type="radio"
            name="tie-breaker"
            value="value"
            checked={tieBreaker === "value"}
          />
          Value
        </label>
        <label style={{ color: "green" }}>
          <input
            type="radio"
            name="tie-breaker"
            value="nodeId"
            checked={tieBreaker === "nodeId"}
          />
          Node ID
        </label>
        <label style={{ color: "red" }}>
          <input
            type="radio"
            name="tie-breaker"
            value="reject"
            checked={tieBreaker === "reject"}
          />
          Always Reject
        </label>
        <label style={{ color: "red" }}>
          <input
            type="radio"
            name="tie-breaker"
            value="take"
            checked={tieBreaker === "take"}
          />
          Always Take
        </label>
        <button onClick={reset} className={styles.btn}>
          Reset Example
        </button>
      </fieldset>
      <strong>Node A:</strong>
      <div className={styles.tie_contain}>
        <TieTbl row={state.a} />
        <button
          className={styles.btn}
          disabled={hasMerged("a", "b")}
          onClick={() => merge("a", "b")}
          style={{ marginRight: 4 }}
        >
          Merge B Here
        </button>
        <button
          className={styles.btn}
          disabled={hasMerged("a", "c")}
          onClick={() => merge("a", "c")}
        >
          Merge C Here
        </button>
      </div>
      <strong>Node B:</strong>
      <div className={styles.tie_contain}>
        <TieTbl row={state.b} />
        <button
          className={styles.btn}
          disabled={hasMerged("b", "a")}
          onClick={() => merge("b", "a")}
          style={{ marginRight: 4 }}
        >
          Merge A Here
        </button>
        <button
          className={styles.btn}
          disabled={hasMerged("b", "c")}
          onClick={() => merge("b", "c")}
        >
          Merge C Here
        </button>
      </div>
      <strong>Node C:</strong>
      <div className={styles.tie_contain}>
        <TieTbl row={state.c} />
        <button
          className={styles.btn}
          disabled={hasMerged("c", "a")}
          onClick={() => merge("c", "a")}
          style={{ marginRight: 4 }}
        >
          Merge A Here
        </button>
        <button
          className={styles.btn}
          disabled={hasMerged("c", "b")}
          onClick={() => merge("c", "b")}
        >
          Merge B Here
        </button>
      </div>
    </div>
  );
}
