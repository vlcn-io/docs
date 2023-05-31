import React, { useEffect, useMemo, useState } from "react";
import { getResouce } from "../CodeNode";
import DAG, { NodeName } from "./DAG";
import { Node, NodeState } from "./Node";
import asTrackedMutations from "./trackMutations";

export default function Nodes() {
  const [mutations, setMutations] = useState<{
    resolution?: any;
    rejection?: any;
    version?: number;
  }>({});
  const [initialState, setInitialState] = useState<{
    resolution?: any;
    rejection?: any;
    version?: number;
  }>({});

  const trackedMutations = useMemo(() => {
    if (mutations.resolution) {
      return asTrackedMutations(mutations.resolution);
    }
    return {};
  }, [mutations]);

  const [nodeStates, setNodeStates] = useState<{
    [Property in NodeName]: NodeState;
  }>({
    nodeA: {
      dag: new DAG("nodeA"),
      state: null,
    },
    nodeB: {
      dag: new DAG("nodeB"),
      state: null,
    },
    nodeC: {
      dag: new DAG("nodeC"),
      state: null,
    },
  });

  function resetNodeStates(maybeInitialState?: any) {
    const state = maybeInitialState || initialState.resolution;
    if (state == null) {
      return;
    }
    setNodeStates({
      nodeA: {
        dag: new DAG("nodeA"),
        state: structuredClone(state),
      },
      nodeB: {
        dag: new DAG("nodeB"),
        state: structuredClone(state),
      },
      nodeC: {
        dag: new DAG("nodeC"),
        state: structuredClone(state),
      },
    });
  }

  useEffect(() => {
    const mutationsResource = getResouce("mutations");
    const stateResource = getResouce("state");
    const offMutationsResource = mutationsResource.on(
      (_id, resolution, rejection, version) => {
        if (mutations.version == null || mutations.version < version) {
          setMutations({
            resolution,
            rejection,
            version,
          });
          resetNodeStates();
        }
      }
    );
    const offStateResource = stateResource.on(
      (_id, resolution, rejection, version) => {
        if (initialState.version == null || initialState.version < version) {
          setInitialState({
            resolution,
            rejection,
            version,
          });
          resetNodeStates(resolution);
        }
      }
    );
    return () => {
      offMutationsResource();
      offStateResource();
    };
  }, []);

  if (mutations.rejection || initialState.rejection) {
    return (
      <div>
        Error: {mutations.rejection} {initialState.rejection}
      </div>
    );
  }

  if (mutations.resolution == null || initialState.resolution == null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {Object.entries(nodeStates).map(([nodeName, nodeState]) => (
        <Node
          key={nodeName}
          mutations={trackedMutations}
          name={nodeName as NodeName}
          state={nodeState}
        />
      ))}
    </div>
  );
}

/*
use mutations;
use state;

const [reactDom, htm] = await Promise.all([
  import("https://esm.sh/react-dom@18.2.0/client"),
  import("https://esm.sh/htm@3.1.1/react")
]);

const { html } = htm;
const { createRoot } = reactDom;

// Give each node its own copy of the state
const nodeA = {
  state: structuredClone(state)
};
const nodeB = {
  state: structuredClone(state)
};
const nodeC = {
  state: structuredClone(state)
};

// Controls for applying mutations
function MutationControls({node}) {
  return html\`<div>
    \${Object.entries(mutations).map(([name, fn]) => html\`<\${Mutation} node={node} name=\${name} fn=\${fn} />\`)};
  </div>\`;
}

function Mutation({node, name, fn}) {
  const numArgs = fn.length - 1;
  function runMutation() {
    const args = Array.from(this.parentNode.querySelectorAll("input")).map((input) => input.value);
    fn(node.state, ...args);
  }

  return html\`<div>
    <button onClick=\${runMutation}>Apply \${name}</button>
    \${Array.from({length: numArgs}).map((_, i) => html\`<input type="text" placeholder="arg \${i + 1}" />\`)}
  </div>\`;
}

use mutations;

// wrap the mutations in logic to:
// 1. add to our event log
// 2. apply the mutation to the state

const trackedMutations = Object.entries(mutations).reduce((acc, [name, fn]) => {
  acc[name] = (node, ...args) => {
    const event = {
      name,
      args
    };
    node.events = node.events || [];
    node.events.push(event);
    fn(state, ...args);
  };
  return acc;
}, {});

provide trackedMutations;
*/
