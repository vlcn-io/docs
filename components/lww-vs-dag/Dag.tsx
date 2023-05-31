import React from "react";
import { CtxAsync as Ctx } from "@vlcn.io/react";
import { DBAsync, TXAsync } from "@vlcn.io/xplat-api";
import DagStateGraph from "./DagStateGraph";
import TodoList, { Event } from "./TodoList";
import { newIID } from "./id";
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

export default function Dag({
  dagCtxts,
}: {
  dagCtxts: readonly [Ctx, Ctx, Ctx];
}) {
  const ctxts = dagCtxts;
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
          await ctx.db.execA("DELETE FROM todo WHERE 1");
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
      <center>
        <h2>DAG State Example</h2>
      </center>
      <p>
        Rather than just keeping the final state as is done with LWW, the DAG
        example keeps a record of every event. These events are linked together
        into a &quot;causal graph&quot; to represent which events caused which
        others. Processing the graph gives us the final state. <br />
        <br />
        In the examples below you can add todos to different lists and sync all
        the lists. The causal graphs for each node are depicted below the lists.
      </p>
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
  // transact
  // re-process the full dag.
  // Figure out incremental processing later.
  const dag = await ctx.db.execA(pullDagQuery);
  for (const [_eventId, itemId, type, value] of dag) {
    await processEvent(ctx.db, ctx.db.siteid, { itemId, type, value });
  }
}

async function processNewEvent(ctx: Ctx, event: Event) {
  await ctx.db.tx(async (tx) => {
    // get the leave(s) that will be parents of new event
    let parents = await tx.execA(leavesQuery);
    if (parents.length == 0) {
      parents = [["ROOT"]];
    }
    // process the event
    const eventId = await processEvent(tx, ctx.db.siteid, event);
    await tx.exec(`INSERT INTO event VALUES (?, ?, ?, ?)`, [
      eventId,
      event.itemId,
      event.type,
      event.value,
    ]);
    // add the event into the dag
    for (const parent of parents) {
      await tx.execA("INSERT OR IGNORE INTO event_dag VALUES (?, ?, 0)", [
        parent[0],
        eventId,
      ]);
    }
  });
}

async function processEvent(
  tx: TXAsync,
  siteid: string,
  event: Event
): Promise<bigint> {
  const eventId = newIID(siteid.replaceAll("-", ""));
  switch (event.type) {
    case "add":
      // on conflict clause for inserts so we can
      // replay the event log without dropping table contents
      await tx.exec(
        `INSERT INTO todo (id, "text", completed) VALUES (?, ?, ?)
        ON CONFLICT DO UPDATE SET "text" = excluded."text", completed = excluded.completed`,
        [event.itemId, event.value || "", 0]
      );
      break;
    case "remove":
      await tx.exec("DELETE FROM todo WHERE id = ?", [event.itemId]);
      break;
    case "complete":
      await tx.exec("UPDATE todo SET completed = ? WHERE id = ?", [
        event.value,
        event.itemId,
      ]);
      break;
    case "rename":
      await tx.exec('UPDATE todo SET "text" = ? WHERE id = ?', [
        event.value,
        event.itemId,
      ]);
      break;
    case "completeAll":
      await tx.exec(`UPDATE todo SET completed = true WHERE completed = false`);
      break;
    case "uncompleteAll":
      await tx.exec(`UPDATE todo SET completed = false WHERE completed = true`);
      break;
    case "clearCompleted":
      await tx.exec(`DELETE FROM todo WHERE completed = true`);
      break;
  }

  return eventId;
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

SELECT DISTINCT event.id, event.item_id, event.type, event.value
  FROM after_node JOIN event
  ON after_node.event_id = event.id;
`;
