import React from "react";
import { CtxAsync as Ctx } from "@vlcn.io/react";
import { DBAsync, TXAsync } from "@vlcn.io/xplat-api";
import DagStateGraph from "./DagStateGraph";
import TodoList, { Mutation, Todo } from "./TodoList";
import { newIID, IID_of } from "./id";
import EventTable from "./EventTable";
const nodeNames = ["A", "B", "C"];
import styles from "./style.module.css";

async function syncLeftToRight(l: DBAsync, r: DBAsync) {
  // We're just pulling all changes. We could pull delta states but this is a basic example.
  // use: `SELECT * FROM crsql_changes WHERE db_version > ?` to select delta states.
  const lChanges = await l.execA("SELECT * FROM crsql_changes");
  await r.tx(async (tx) => {
    for (const change of lChanges) {
      await tx.execA(
        "INSERT INTO crsql_changes VALUES (?, ?, ?, ?, ?, ?, ?)",
        change
      );
    }
  });
}

export default function Dag({ ctxts }: { ctxts: readonly [Ctx, Ctx, Ctx] }) {
  const [syncing, setSyncing] = React.useState(false);
  const syncNodes = async () => {
    if (syncing) {
      return;
    }

    setSyncing(true);
    try {
      await syncLeftToRight(ctxts[0].db, ctxts[1].db);
      await syncLeftToRight(ctxts[1].db, ctxts[2].db);
      await syncLeftToRight(ctxts[2].db, ctxts[1].db);
      await syncLeftToRight(ctxts[1].db, ctxts[0].db);

      await Promise.all(ctxts.map(processDAG));
    } finally {
      setSyncing(false);
    }
  };
  const resetState = async () => {
    if (syncing) {
      return;
    }

    setSyncing(true);
    try {
      await Promise.all(
        ctxts.map(async (ctx) => {
          await ctx.db.execA("DELETE FROM todo");
          await ctx.db.execA("UPDATE counter SET count = 0");
          await ctx.db.execA("DELETE FROM event");
          await ctx.db.execA("DELETE FROM event_dag");
          await ctx.db.execA("DELETE FROM event__crsql_clock");
          await ctx.db.execA("DELETE FROM event_dag__crsql_clock");
        })
      );
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", height: 350, overflowY: "scroll" }}>
        {ctxts.map((ctx, i) => {
          return (
            <section className={styles.todoapp} key={i}>
              <div style={{ background: "white" }}>
                <TodoList
                  ctx={ctx}
                  nodeName={nodeNames[i]}
                  eventHandler={processNewEvent}
                  ex="dag"
                />
              </div>
            </section>
          );
        })}
      </div>
      <div>
        <center>
          <button className={styles.btn} disabled={syncing} onClick={syncNodes}>
            Sync Nodes &#128259;
          </button>
          <button
            className={styles.btn + " " + styles["btn-secondary"]}
            disabled={syncing}
            onClick={resetState}
          >
            Reset
          </button>
        </center>
      </div>
      <div style={{ display: "flex" }}>
        {ctxts.map((ctx, i) => {
          return (
            <section className={styles.todoapp} key={i}>
              <DagStateGraph ctx={ctx} nodeName={nodeNames[i]} />
            </section>
          );
        })}
      </div>
      <div style={{ display: "flex" }}>
        {ctxts.map((ctx, i) => {
          return (
            <section className={styles.todoapp} key={i}>
              <EventTable ctx={ctx} nodeName={nodeNames[i]} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

async function processDAG(ctx: Ctx) {
  await ctx.db.tx(async (tx) => {
    const dag = await tx.execA(pullDagQuery);
    // we're re-processing the entire dag so we have to drop our tables.
    // in a real system we'd roll back to the closest snapshot and re-process from there.
    await tx.exec(`DELETE FROM todo`);
    await tx.exec(`UPDATE counter SET count = 0`);

    for (const [_eventId, mutationName, args] of dag) {
      await processEvent(tx, ctx.db.siteid, mutationName, args);
    }
  });
}

async function processNewEvent(ctx: Ctx, event: Mutation) {
  await ctx.db.tx(async (tx) => {
    // @ts-ignore
    tx.siteid = ctx.db.siteid;
    const mutation = trackedMutations[event.name];
    // @ts-ignore
    mutation(tx, ...event.args);
  });
}

async function processEvent(
  tx: TXAsync,
  siteid: string,
  mutationName: keyof typeof bareMutations,
  args: string
) {
  const mutation = bareMutations[mutationName];
  // @ts-ignore
  tx.siteid = siteid;
  // @ts-ignore
  await mutation(tx, ...JSON.parse(args));
}

// TODO: this is an index scan.
// We should optimize.
const leavesQuery = `SELECT l.event_id
  FROM event_dag as l
  WHERE NOT EXISTS (SELECT NULL FROM event_dag as r WHERE r.parent_id = l.event_id)`;

// we're recomputing the full dag every time but we can do an incremental process:
// We can:
// 1. go thru each new item in merge or local evt
// 2. grab parent id and add to [seen set], [have parent set]
// 3. if parent id in seen set, remove from [have parent set]
// 4. find LCP of [have parent set]
// 5. traverse DAG from that point forward
const pullDagQuery = `WITH RECURSIVE
after_node(event_id,level) AS (
  VALUES('ROOT',0)
  UNION ALL
  SELECT event_dag.event_id, after_node.level+1
    FROM event_dag JOIN after_node ON event_dag.parent_id=after_node.event_id
   ORDER BY 2,1 DESC
)

SELECT DISTINCT event.id, event.mutation_name, event.args
  FROM after_node JOIN event
  ON after_node.event_id = event.id;
`;

const bareMutations = {
  async add(tx: TXAsync, todoId: IID_of<Todo>, content: string) {
    await tx.exec(
      /*sql*/ `INSERT INTO todo (id, content, completed) VALUES (?, ?, ?)`,
      [todoId, content, 0]
    );
  },
  async remove(tx: TXAsync, todoId: IID_of<Todo>) {
    await tx.exec(`DELETE FROM todo WHERE id = ?`, [todoId]);
  },
  async complete(tx: TXAsync, todoId: IID_of<Todo>, complete: number) {
    await tx.exec(`UPDATE todo SET completed = ? WHERE id = ?`, [
      complete,
      todoId,
    ]);
  },
  async rename(tx: TXAsync, todoId: IID_of<Todo>, content: string) {
    await tx.exec(`UPDATE todo SET content = ? WHERE id = ?`, [
      content,
      todoId,
    ]);
  },
  async completeAll(tx: TXAsync) {
    await tx.exec(`UPDATE todo SET completed = 1 WHERE completed = 0`);
  },
  async uncompleteAll(tx: TXAsync) {
    await tx.exec(`UPDATE todo SET completed = 0 WHERE completed = 1`);
  },
  async clearCompleted(tx: TXAsync) {
    await tx.exec(`DELETE FROM todo WHERE completed = 1`);
  },
  async increment(tx: TXAsync) {
    const current = (await tx.execA(`SELECT count FROM counter`))[0]?.[0] || 0;
    await tx.exec(`INSERT OR REPLACE INTO counter (id, count) VALUES (0, ?)`, [
      current + 1,
    ]);
  },
} as const;

const trackedMutations = asTrackedMutations(bareMutations);

function asTrackedMutations(mutations: typeof bareMutations) {
  const result: any = {};
  for (const [name, fn] of Object.entries(mutations)) {
    result[name] = async function (tx: TXAsync, ...args: any[]) {
      // get the leave(s) that will be parents of new event
      // TODO: this is an index scan.
      // We should optimize.
      let parents = await tx.execA(
        `SELECT l.event_id FROM event_dag as l WHERE NOT EXISTS (SELECT NULL FROM event_dag as r WHERE r.parent_id = l.event_id)`
      );
      if (parents.length == 0) {
        parents = [["ROOT"]];
      }

      // process the event
      // @ts-ignore
      await fn(tx, ...args);

      // compute an id for the event
      // @ts-ignore
      const eventId = newIID(tx.siteid);

      // write the event
      await tx.exec(
        `INSERT INTO event (id, mutation_name, args) VALUES (?, ?, ?)`,
        [eventId, name, JSON.stringify(args)]
      );

      // link the event into the DAG
      for (const parent of parents) {
        try {
          await tx.execA(`INSERT OR IGNORE INTO event_dag VALUES (?, ?)`, [
            parent[0],
            eventId,
          ]);
        } catch (e) {
          console.log(e);
        }
      }
    };
  }
  return result as typeof bareMutations;
}
