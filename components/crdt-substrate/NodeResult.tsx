// @ts-ignore
import { ObjectView } from "react-object-view";
import { NodeState } from "./Node";

const palette = {
  base00: "#192830",
};

export default function NodeResult({ state }: { state: NodeState }) {
  return (
    <ObjectView
      data={{ "": state.state }}
      palette={palette}
      options={{ expandLevel: 2 }}
    />
  );
}
