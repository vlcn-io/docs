import { NodeState } from "./Node";

export type Mutations = {
  [key: string]: Mutation;
};

export type Mutation = {
  (state: NodeState, args: any[]): any;
  numArgs: number;
};

export type RawMutations = {
  [key: string]: (state: any, args: any[]) => void;
};

export default function asTrackedMutations(mutations: RawMutations): Mutations {
  const ret: any = {};
  for (const [name, fn] of Object.entries(mutations)) {
    ret[name] = (state: NodeState, args: any[]): NodeState => {
      const copy = structuredClone(state.state);
      fn(copy, args);
      state.dag.addEvent({
        mutationName: name,
        mutationArgs: args,
      });
      return {
        state: copy,
        dag: state.dag,
      };
    };
    ret[name].numArgs = fn.length - 1;
  }

  return ret;
}
