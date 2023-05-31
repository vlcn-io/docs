import { useState } from "react";
import { NodeState } from "./Node";
import type { Mutation as Mut } from "./trackMutations";

export default function Mutation({
  name,
  fn,
  onClick,
}: {
  name: string;
  fn: Mut;
  onClick: (fn: (state: NodeState) => NodeState) => void;
}) {
  const applyMutation = (state: NodeState) => {
    const ret = fn(state, args);
    setArgs(Array.from({ length: (fn as any).numArgs }));
    return ret;
  };

  const [args, setArgs] = useState<any[]>(
    Array.from({ length: (fn as any).numArgs })
  );

  return (
    <tr key={name}>
      <td>
        <button onClick={() => onClick(applyMutation)}>{name}</button>
      </td>
      {new Array((fn as any).numArgs).fill(null).map((_, i) => {
        return (
          <td key={i}>
            <input
              type="text"
              onChange={(e) => {
                setArgs((args) => {
                  const newArgs = [...args];
                  newArgs[i] = e.target.value;
                  return newArgs;
                });
              }}
              value={args[i] || ""}
            />
          </td>
        );
      })}
    </tr>
  );
}
