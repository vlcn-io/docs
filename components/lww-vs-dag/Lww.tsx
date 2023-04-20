import React from "react";
import { CtxAsync as Ctx } from "@vlcn.io/react";
import TodoList, { Event } from "./TodoList";
import LwwStateTable from "./LwwStateTable";
import { DBAsync } from "@vlcn.io/xplat-api";
import styles from "./style.module.css";

const nodeNames = ["A", "B", "C"];

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

export default function Lww({
  lwwCtxts,
}: {
  lwwCtxts: readonly [Ctx, Ctx, Ctx];
}) {
  const [syncing, setSyncing] = React.useState(false);
  const ctxts = lwwCtxts;
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
    } finally {
      setSyncing(false);
    }
  };
  /**
   * Draw three lists
   * In a smallish way
   * Output the state table below, joined against the version vectors
   */
  return (
    <div>
      <center>
        <h2>LLW State Example</h2>
      </center>
      <div style={{ display: "flex", height: 400, overflowY: "scroll" }}>
        {ctxts.map((ctx, i) => {
          return (
            <section className={styles.todoapp} key={i}>
              <div style={{ background: "white" }}>
                <TodoList
                  ctx={ctx}
                  nodeName={nodeNames[i]}
                  eventHandler={processLocalEvent}
                  ex="lww"
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
        </center>
      </div>
      <div style={{ display: "flex" }}>
        {ctxts.map((ctx, i) => {
          return (
            <section className={styles.todoapp} key={i}>
              <LwwStateTable ctx={ctx} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

async function processLocalEvent(ctx: Ctx, event: Event) {
  switch (event.type) {
    case "add":
      await ctx.db.exec(
        'INSERT INTO todo (id, "text", completed) VALUES (?, ?, ?)',
        [event.itemId, event.value || "", 0]
      );
      break;
    case "remove":
      await ctx.db.exec("DELETE FROM todo WHERE id = ?", [event.itemId]);
      break;
    case "complete":
      await ctx.db.exec("UPDATE todo SET completed = ? WHERE id = ?", [
        event.value,
        event.itemId,
      ]);
      break;
    case "rename":
      await ctx.db.exec('UPDATE todo SET "text" = ? WHERE id = ?', [
        event.value,
        event.itemId,
      ]);
      break;
    case "completeAll":
      await ctx.db.exec(
        `UPDATE todo SET completed = true WHERE completed = false`
      );
      break;
    case "uncompleteAll":
      await ctx.db.exec(
        `UPDATE todo SET completed = false WHERE completed = true`
      );
      break;
    case "clearCompleted":
      await ctx.db.exec(`DELETE FROM todo WHERE completed = true`);
      break;
  }
}
