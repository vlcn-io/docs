import { useMemo } from "react";
import DAG, { NodeName } from "./DAG";
import styles from "./node.module.css";
import { Mutations } from "./trackMutations";

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
  const maxArgs = useMemo(() => {
    return Object.entries(mutations).reduce((acc, [name, fn]) => {
      return Math.max(acc, (fn as any).numArgs);
    }, 0);
  }, [mutations]);
  return (
    <div className={styles.node}>
      <div className={styles.nodeTable}>
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
                <tr key={name}>
                  <td>
                    <button>{name}</button>
                  </td>
                  {new Array((fn as any).numArgs).fill(null).map((_, i) => {
                    return (
                      <td key={i}>
                        <input type="text" />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.nodeState}>dsdf</div>
    </div>
  );
}
