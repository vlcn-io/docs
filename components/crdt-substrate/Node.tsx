import { useMemo, useState } from "react";
import DAG, { NodeName } from "./DAG";
import styles from "./node.module.css";
import { Mutations } from "./trackMutations";
import Mutation from "./Mutation";
import NodeResult from "./NodeResult";

export type NodeState = { dag: DAG; state: any };

export function Node({
  mutations,
  name,
  state,
}: {
  mutations: Mutations;
  name: NodeName;
  state: NodeState;
}) {
  const [priorState, setPriorState] = useState<NodeState>(state);
  const [theState, setTheState] = useState<NodeState>(state);

  function applyMutation(fn: (state: NodeState) => NodeState) {
    setTheState(fn(theState));
  }

  // reset from outer component
  if (state != priorState) {
    setPriorState(state);
    setTheState(state);
  }

  const maxArgs = useMemo(() => {
    return Object.entries(mutations).reduce((acc, [name, fn]) => {
      return Math.max(acc, (fn as any).numArgs);
    }, 0);
  }, [mutations]);

  return (
    <div className={styles.root}>
      <h1>
        N{name.substring(1, 4)} {name.substring(4)}
      </h1>
      <div className={styles.node}>
        <div className={styles.nodeTable}>
          <h2>Mutations</h2>
          <table>
            <thead>
              <tr>
                <th>mutation</th>
                <th colSpan={maxArgs + 1} style={{ textAlign: "left" }}>
                  args...
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mutations).map(([name, fn]) => {
                return (
                  <Mutation
                    fn={fn}
                    onClick={applyMutation}
                    key={name}
                    name={name}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.nodeState}>
          <h2>State</h2>
          <NodeResult state={theState} />
        </div>
      </div>
    </div>
  );
}
