export type DAGNode = {
  parents: Set<DAGNode>;
  id:
    | "ROOT"
    | {
        seq: number;
        node: NodeName;
      };
  event: Event;
};

export type Event = {
  mutationName: string;
  mutationArgs: any[];
};

export type NodeName = "nodeA" | "nodeB" | "nodeC";

const sequenceNumbers = {
  nodeA: 0,
  nodeB: 0,
  nodeC: 0,
};

export default class DAG {
  root: DAGNode;
  nodeRelation: Set<DAGNode> = new Set();

  constructor(public nodeName: NodeName, root?: DAGNode) {
    if (root) {
      this.root = root;
    } else {
      this.root = {
        parents: new Set(),
        id: "ROOT",
        event: {
          mutationName: "",
          mutationArgs: [],
        },
      };
    }

    this.nodeRelation.add(this.root);
  }

  addEvent(event: Event) {
    const node: DAGNode = {
      parents: this.findLeaves(),
      id: {
        seq: sequenceNumbers[this.nodeName]++,
        node: this.nodeName,
      },
      event,
    };
    this.nodeRelation.add(node);

    return node;
  }

  findLeaves(): Set<DAGNode> {
    const leaves = new Set<DAGNode>([...this.nodeRelation]);
    for (const n of this.nodeRelation) {
      // if p is a parent then it is not a leaf. Remove it from the leaves set.
      for (const p of n.parents) {
        leaves.delete(p);
      }
    }

    return leaves;
  }

  getEventsInOrder(): DAGNode[] {
    const graph = new Map<DAGNode, DAGNode[]>();
    for (const n of this.nodeRelation) {
      graph.set(n, []);
    }

    // Convert the graph so we have child pointers.
    for (const n of this.nodeRelation) {
      for (const p of n.parents) {
        graph.get(p)!.push(n);
      }
    }

    // Now sort the children of each node by their id. IDs never collide given node id is encoded into the id.
    for (const children of graph.values()) {
      children.sort((a, b) => {
        const aId = a.id as { seq: number; node: NodeName };
        const bId = b.id as { seq: number; node: NodeName };
        if (aId.seq == bId.seq) {
          return aId.node < bId.node ? -1 : 1;
        }
        return aId.seq - bId.seq;
      });
    }

    // Finally do our depth first traversal.
    const events: DAGNode[] = [];
    const visited = new Set<DAGNode>();
    const visit = (n: DAGNode) => {
      if (visited.has(n)) {
        return;
      }
      visited.add(n);
      for (const c of graph.get(n)!) {
        visit(c);
      }
      events.push(n);
    };
    visit(this.root);

    return events;
  }
}
