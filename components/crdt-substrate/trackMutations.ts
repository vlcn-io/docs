import { NodeState } from "./Node";

export type Mutations = {
  [key: string]: Mutation;
};

export type Mutation = {
  (state: NodeState, args: any[]): any;
  numArgs: number;
};

export type RawMutations = {
  [key: string]: (state: any, args: any[]) => boolean | undefined;
};

export default function asTrackedMutations(mutations: RawMutations): Mutations {
  const ret: any = {};
  for (const [name, fn] of Object.entries(mutations)) {
    ret[name] = (state: NodeState, args: any[]): NodeState => {
      const copy = structuredClone(state.state);
      // @ts-ignore
      const ret = fn(copy, ...args);
      if (ret === false) {
        return {
          state: copy,
          dag: state.dag,
        };
      }
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
